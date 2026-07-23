import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const STATUS_FLOW = [
  "Aguardando",
  "Confirmado",
  "Separado",
  "Saiu para entrega",
  "Entregue",
];

export interface OrderItem {
  sku: string;
  produto: string;
  quantidade: number;
  preco_unit: number;
}

export interface Order {
  id: string;
  numero: string;
  cliente: string;
  cliente_uid: string;
  status: string;
  status_index: number;
  items: OrderItem[];
  valor_total: number;
  criado_em: string;
  atualizado_em: string;
  endereco_entrega: string;
}

function toOrder(order: any): Order {
  return {
    id: order.id,
    numero: order.numero,
    cliente: order.cliente?.nome || "",
    cliente_uid: order.cliente_uid,
    status: order.status,
    status_index: STATUS_FLOW.indexOf(order.status) || 0,
    items: (order.items || []).map((item: any) => ({
      sku: item.product?.sku || "",
      produto: item.product?.nome || "",
      quantidade: item.quantidade,
      preco_unit: Number(item.preco_unit),
    })),
    valor_total: order.valor_total ? Number(order.valor_total) : 0,
    criado_em: order.criado_em?.toISOString?.() || order.criado_em,
    atualizado_em: order.atualizado_em?.toISOString?.() || order.atualizado_em || order.criado_em?.toISOString?.() || "",
    endereco_entrega: order.endereco_entrega || "",
  };
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(cliente_uid?: string): Promise<Order[]> {
    const where: any = {};
    if (cliente_uid) where.cliente_uid = cliente_uid;

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        cliente: { select: { nome: true } },
        items: {
          include: { product: { select: { sku: true, nome: true } } },
        },
      },
      orderBy: { criado_em: "desc" },
    });

    return orders.map(toOrder);
  }

  async findByNumero(numero: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { numero },
      include: {
        cliente: { select: { nome: true } },
        items: {
          include: { product: { select: { sku: true, nome: true } } },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Pedido #${numero} não encontrado`);
    }
    return toOrder(order);
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        cliente: { select: { nome: true } },
        items: {
          include: { product: { select: { sku: true, nome: true } } },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Pedido ${id} não encontrado`);
    }
    return toOrder(order);
  }

  getStatusFlow(): string[] {
    return STATUS_FLOW;
  }
}
