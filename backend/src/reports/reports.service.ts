import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface SalesSummary {
  total_vendas: number;
  total_pedidos: number;
  ticket_medio: number;
  total_clientes: number;
  media_por_cliente: number;
}

export interface SalesByPeriod {
  periodo: string;
  vendas: number;
  pedidos: number;
}

export interface SalesByCategory {
  categoria: string;
  vendas: number;
  quantidade: number;
}

export interface TopProduct {
  sku: string;
  produto: string;
  quantidade: number;
  receita: number;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const orders = await this.prisma.order.findMany();
    const totalVendas = orders.reduce((s, o) => s + Number(o.valor_total || 0), 0);
    const totalPedidos = orders.length;
    const clientes = await this.prisma.user.count();

    return {
      total_vendas: totalVendas,
      total_pedidos: totalPedidos,
      ticket_medio: totalPedidos > 0 ? Math.round(totalVendas / totalPedidos) : 0,
      total_clientes: clientes,
      media_por_cliente: clientes > 0 ? Math.round(totalVendas / clientes) : 0,
    };
  }

  async getSalesByPeriod(inicio?: string, fim?: string) {
    const orders = await this.prisma.order.findMany({
      orderBy: { criado_em: "asc" },
    });

    const monthly = new Map<string, { vendas: number; pedidos: number }>();
    for (const o of orders) {
      const key = o.criado_em
        ? `${o.criado_em.getFullYear()}-${String(o.criado_em.getMonth() + 1).padStart(2, "0")}`
        : "desconhecido";
      if (inicio && key < inicio) continue;
      if (fim && key > fim) continue;

      const curr = monthly.get(key) || { vendas: 0, pedidos: 0 };
      curr.vendas += Number(o.valor_total || 0);
      curr.pedidos++;
      monthly.set(key, curr);
    }

    return Array.from(monthly.entries()).map(([periodo, v]) => ({
      periodo,
      vendas: v.vendas,
      pedidos: v.pedidos,
    }));
  }

  async getSalesByCategory() {
    const items = await this.prisma.orderItem.findMany({
      include: {
        product: { select: { categoria: true } },
      },
    });

    const cats = new Map<string, { vendas: number; quantidade: number }>();
    for (const item of items) {
      const cat = item.product?.categoria || "Sem categoria";
      const curr = cats.get(cat) || { vendas: 0, quantidade: 0 };
      curr.vendas += Number(item.preco_unit) * item.quantidade;
      curr.quantidade += item.quantidade;
      cats.set(cat, curr);
    }

    return Array.from(cats.entries()).map(([categoria, v]) => ({
      categoria,
      vendas: v.vendas,
      quantidade: v.quantidade,
    }));
  }

  async getTopProducts(limit = 10) {
    const items = await this.prisma.orderItem.findMany({
      include: {
        product: { select: { sku: true, nome: true } },
      },
    });

    const prods = new Map<string, { sku: string; produto: string; quantidade: number; receita: number }>();
    for (const item of items) {
      const pid = item.product_id;
      const curr = prods.get(pid) || {
        sku: item.product?.sku || "",
        produto: item.product?.nome || "",
        quantidade: 0,
        receita: 0,
      };
      curr.quantidade += item.quantidade;
      curr.receita += Number(item.preco_unit) * item.quantidade;
      prods.set(pid, curr);
    }

    return Array.from(prods.values())
      .sort((a, b) => b.receita - a.receita)
      .slice(0, limit);
  }

  async exportCSV(
    tipo: "vendas" | "categorias" | "produtos",
    inicio?: string,
    fim?: string
  ) {
    switch (tipo) {
      case "vendas": {
        const data = await this.getSalesByPeriod(inicio, fim);
        const lines = ["Período;Vendas (R$);Pedidos"];
        data.forEach((d) => lines.push(`${d.periodo};${d.vendas};${d.pedidos}`));
        return lines.join("\n");
      }
      case "categorias": {
        const data = await this.getSalesByCategory();
        const lines = ["Categoria;Vendas (R$);Quantidade"];
        data.forEach((d) => lines.push(`${d.categoria};${d.vendas};${d.quantidade}`));
        return lines.join("\n");
      }
      case "produtos": {
        const data = await this.getTopProducts();
        const lines = ["SKU;Produto;Quantidade;Receita (R$)"];
        data.forEach((d) => lines.push(`${d.sku};${d.produto};${d.quantidade};${d.receita}`));
        return lines.join("\n");
      }
    }
  }
}
