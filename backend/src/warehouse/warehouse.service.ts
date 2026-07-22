import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

export interface PickRequest {
  id: string;
  pedido_numero: string;
  sku: string;
  produto: string;
  quantidade_solicitada: number;
  quantidade_separada: number;
  status: "pendente" | "separando" | "concluido" | "erro";
  local_estoque: string;
  criado_em: string;
  atualizado_em: string;
  observacao?: string;
}

export interface PickingEvent {
  pickId: string;
  pedidoNumero: string;
  tipo: "picking.start" | "picking.done" | "picking.error";
  timestamp: string;
  dados?: Record<string, unknown>;
}

const MOCK_PICKS: PickRequest[] = [
  {
    id: "pk-001",
    pedido_numero: "10482",
    sku: "RS001",
    produto: "Resina Composta Z350 XT - 4g",
    quantidade_solicitada: 10,
    quantidade_separada: 0,
    status: "pendente",
    local_estoque: "A-12",
    criado_em: "2026-07-21T08:00:00",
    atualizado_em: "2026-07-21T08:00:00",
  },
  {
    id: "pk-002",
    pedido_numero: "10482",
    sku: "ADP01",
    produto: "Adesivo Ambar Universal 5ml",
    quantidade_solicitada: 5,
    quantidade_separada: 3,
    status: "separando",
    local_estoque: "B-07",
    criado_em: "2026-07-21T08:00:00",
    atualizado_em: "2026-07-21T09:30:00",
  },
  {
    id: "pk-003",
    pedido_numero: "10483",
    sku: "ANES01",
    produto: "Anestésico Lidocaína 2% - 1,8ml (cx 50)",
    quantidade_solicitada: 2,
    quantidade_separada: 2,
    status: "concluido",
    local_estoque: "C-03",
    criado_em: "2026-07-20T14:00:00",
    atualizado_em: "2026-07-21T10:00:00",
  },
  {
    id: "pk-004",
    pedido_numero: "10484",
    sku: "RS001",
    produto: "Resina Composta Z350 XT - 4g",
    quantidade_solicitada: 20,
    quantidade_separada: 0,
    status: "pendente",
    local_estoque: "A-12",
    criado_em: "2026-07-21T10:00:00",
    atualizado_em: "2026-07-21T10:00:00",
  },
];

const MOCK_EVENT_LOG: PickingEvent[] = [];

@Injectable()
export class WarehouseService {
  private readonly logger = new Logger(WarehouseService.name);
  private picks = [...MOCK_PICKS];
  private eventLog = [...MOCK_EVENT_LOG];

  constructor(private eventEmitter: EventEmitter2) {}

  async getPicks(status?: string): Promise<PickRequest[]> {
    if (status) return this.picks.filter((p) => p.status === status);
    return this.picks;
  }

  async getPick(id: string): Promise<PickRequest> {
    const pick = this.picks.find((p) => p.id === id);
    if (!pick) throw new NotFoundException(`Pick ${id} não encontrado`);
    return pick;
  }

  async getEvents(): Promise<PickingEvent[]> {
    return this.eventLog;
  }

  async createPick(data: {
    pedido_numero: string;
    sku: string;
    produto: string;
    quantidade: number;
    local_estoque?: string;
  }): Promise<PickRequest> {
    const pick: PickRequest = {
      id: `pk-${String(this.picks.length + 1).padStart(3, "0")}`,
      pedido_numero: data.pedido_numero,
      sku: data.sku,
      produto: data.produto,
      quantidade_solicitada: data.quantidade,
      quantidade_separada: 0,
      status: "pendente",
      local_estoque: data.local_estoque || "Geral",
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };
    this.picks.push(pick);

    this.publishEvent("picking.start", pick);

    return pick;
  }

  async completePick(
    id: string,
    quantidade: number,
    observacao?: string
  ): Promise<PickRequest> {
    const pick = await this.getPick(id);
    pick.quantidade_separada = quantidade;
    pick.status = quantidade >= pick.quantidade_solicitada ? "concluido" : "separando";
    pick.atualizado_em = new Date().toISOString();
    pick.observacao = observacao;

    this.publishEvent(
      pick.status === "concluido" ? "picking.done" : "picking.error",
      pick
    );

    return pick;
  }

  private publishEvent(tipo: PickingEvent["tipo"], pick: PickRequest) {
    const event: PickingEvent = {
      pickId: pick.id,
      pedidoNumero: pick.pedido_numero,
      tipo,
      timestamp: new Date().toISOString(),
      dados: { pick },
    };

    this.eventLog.push(event);
    this.eventEmitter.emit(tipo, event);
    this.logger.log(`Evento ${tipo} → pedido #${pick.pedido_numero} (${pick.id})`);
  }
}
