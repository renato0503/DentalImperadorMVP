import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PrismaService } from "../prisma/prisma.service";

export interface PickRequest {
  id: string;
  pedido_numero: string;
  sku: string;
  produto: string;
  quantidade_solicitada: number;
  quantidade_separada: number;
  status: string;
  local_estoque: string;
  criado_em: Date;
  atualizado_em: Date;
  observacao: string | null;
}

export interface PickingEvent {
  id: string;
  pickId: string;
  pedidoNumero: string;
  tipo: string;
  timestamp: Date;
  dados: string | null;
}

@Injectable()
export class WarehouseService {
  private readonly logger = new Logger(WarehouseService.name);

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async getPicks(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.pickRequest.findMany({
      where,
      orderBy: { criado_em: "desc" },
    });
  }

  async getPick(id: string) {
    const pick = await this.prisma.pickRequest.findUnique({ where: { id } });
    if (!pick) throw new NotFoundException(`Pick ${id} não encontrado`);
    return pick;
  }

  async getEvents() {
    return this.prisma.pickEvent.findMany({
      orderBy: { timestamp: "desc" },
    });
  }

  async createPick(data: {
    pedido_numero: string;
    sku: string;
    produto: string;
    quantidade: number;
    local_estoque?: string;
  }) {
    const pick = await this.prisma.pickRequest.create({
      data: {
        pedido_numero: data.pedido_numero,
        sku: data.sku,
        produto: data.produto,
        quantidade_solicitada: data.quantidade,
        local_estoque: data.local_estoque || "Geral",
      },
    });

    await this.publishEvent("picking.start", pick);
    return pick;
  }

  async completePick(id: string, quantidade: number, observacao?: string) {
    const pick = await this.getPick(id);
    const newStatus =
      quantidade >= pick.quantidade_solicitada ? "concluido" : "separando";

    const updated = await this.prisma.pickRequest.update({
      where: { id },
      data: {
        quantidade_separada: quantidade,
        status: newStatus,
        atualizado_em: new Date(),
        observacao: observacao,
      },
    });

    await this.publishEvent(
      newStatus === "concluido" ? "picking.done" : "picking.error",
      updated
    );

    return updated;
  }

  private async publishEvent(
    tipo: "picking.start" | "picking.done" | "picking.error",
    pick: any
  ) {
    const event = {
      pickId: pick.id,
      pedidoNumero: pick.pedido_numero,
      tipo,
      dados: JSON.stringify({ pick }),
    };

    await this.prisma.pickEvent.create({ data: event });
    this.eventEmitter.emit(tipo, event);
    this.logger.log(
      `Evento ${tipo} → pedido #${pick.pedido_numero} (${pick.id})`
    );
  }
}
