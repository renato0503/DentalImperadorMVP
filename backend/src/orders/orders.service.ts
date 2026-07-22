import { Injectable, NotFoundException } from "@nestjs/common";

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

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    numero: "10482",
    cliente: "Clinica OdontoPlus Ltda",
    cliente_uid: "uUIBiyMZyxNRN7irqO3aRdXqGqi1",
    status: "Separado",
    status_index: 2,
    items: [
      { sku: "RS001", produto: "Resina Composta Z350 XT - 4g", quantidade: 10, preco_unit: 89.9 },
      { sku: "ADP01", produto: "Adesivo Ambar Universal 5ml", quantidade: 5, preco_unit: 129.0 },
    ],
    valor_total: 1544.0,
    criado_em: "2026-07-15T10:30:00",
    atualizado_em: "2026-07-18T14:22:00",
    endereco_entrega: "Av. Historiador Rubens de Mendonça, 3000 - Cuiabá-MT",
  },
  {
    id: "2",
    numero: "10483",
    cliente: "Consultório Dr. Matheus",
    cliente_uid: "NcTtOuP9o6gPXDzHvsCHlG42AIm1",
    status: "Entregue",
    status_index: 4,
    items: [
      { sku: "ALG01", produto: "Alginato CAVEX - Pote 500g", quantidade: 3, preco_unit: 42.5 },
      { sku: "ANES01", produto: "Anestésico Lidocaína 2% - 1,8ml (cx 50)", quantidade: 2, preco_unit: 189.0 },
    ],
    valor_total: 505.5,
    criado_em: "2026-07-10T08:15:00",
    atualizado_em: "2026-07-17T16:45:00",
    endereco_entrega: "Rua Comandante Costa, 500 - Cuiabá-MT",
  },
  {
    id: "3",
    numero: "10484",
    cliente: "Clinica Sorriso Perfeito",
    cliente_uid: "",
    status: "Aguardando",
    status_index: 0,
    items: [
      { sku: "RS001", produto: "Resina Composta Z350 XT - 4g", quantidade: 20, preco_unit: 89.9 },
    ],
    valor_total: 1798.0,
    criado_em: "2026-07-20T09:00:00",
    atualizado_em: "2026-07-20T09:00:00",
    endereco_entrega: "Rua Barão de Melgaço, 1500 - Cuiabá-MT",
  },
];

@Injectable()
export class OrdersService {
  private orders = [...MOCK_ORDERS];

  async findAll(cliente_uid?: string): Promise<Order[]> {
    if (cliente_uid) {
      return this.orders.filter((o) => o.cliente_uid === cliente_uid);
    }
    return this.orders;
  }

  async findByNumero(numero: string): Promise<Order> {
    const order = this.orders.find((o) => o.numero === numero);
    if (!order) {
      throw new NotFoundException(`Pedido #${numero} não encontrado`);
    }
    return order;
  }

  async findOne(id: string): Promise<Order> {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Pedido ${id} não encontrado`);
    }
    return order;
  }

  getStatusFlow(): string[] {
    return STATUS_FLOW;
  }
}
