import { Injectable, Logger } from "@nestjs/common";

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

const MOCK_MONTHLY: SalesByPeriod[] = [
  { periodo: "2026-01", vendas: 28500, pedidos: 32 },
  { periodo: "2026-02", vendas: 31200, pedidos: 38 },
  { periodo: "2026-03", vendas: 28900, pedidos: 35 },
  { periodo: "2026-04", vendas: 35400, pedidos: 42 },
  { periodo: "2026-05", vendas: 38800, pedidos: 45 },
  { periodo: "2026-06", vendas: 42500, pedidos: 50 },
  { periodo: "2026-07", vendas: 32000, pedidos: 47 },
];

const MOCK_CATEGORIES: SalesByCategory[] = [
  { categoria: "Restauradores", vendas: 45200, quantidade: 320 },
  { categoria: "Anestésicos", vendas: 28300, quantidade: 180 },
  { categoria: "Moldagem", vendas: 12400, quantidade: 95 },
  { categoria: "Adesivos", vendas: 19800, quantidade: 140 },
  { categoria: "Instrumentais", vendas: 32100, quantidade: 210 },
  { categoria: "Biossegurança", vendas: 15600, quantidade: 280 },
];

const MOCK_TOP_PRODUCTS: TopProduct[] = [
  { sku: "RS001", produto: "Resina Composta Z350 XT - 4g", quantidade: 145, receita: 13035 },
  { sku: "ANES01", produto: "Anestésico Lidocaína 2% - 1,8ml (cx 50)", quantidade: 98, receita: 18522 },
  { sku: "ADP01", produto: "Adesivo Ambar Universal 5ml", quantidade: 87, receita: 11223 },
  { sku: "ALG01", produto: "Alginato CAVEX - Pote 500g", quantidade: 72, receita: 3060 },
  { sku: "INST01", produto: "Kit Instrumental Básico", quantidade: 45, receita: 15750 },
  { sku: "BIO01", produto: "Luva Procedimento CX 100un", quantidade: 210, receita: 6300 },
];

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  async getSummary(): Promise<SalesSummary> {
    const total = MOCK_MONTHLY.reduce((s, m) => s + m.vendas, 0);
    const pedidos = MOCK_MONTHLY.reduce((s, m) => s + m.pedidos, 0);
    return {
      total_vendas: total,
      total_pedidos: pedidos,
      ticket_medio: pedidos > 0 ? Math.round(total / pedidos) : 0,
      total_clientes: 48,
      media_por_cliente: 48 > 0 ? Math.round(total / 48) : 0,
    };
  }

  async getSalesByPeriod(
    inicio?: string,
    fim?: string
  ): Promise<SalesByPeriod[]> {
    let data = [...MOCK_MONTHLY];
    if (inicio) data = data.filter((d) => d.periodo >= inicio);
    if (fim) data = data.filter((d) => d.periodo <= fim);
    return data;
  }

  async getSalesByCategory(): Promise<SalesByCategory[]> {
    return MOCK_CATEGORIES;
  }

  async getTopProducts(limit = 10): Promise<TopProduct[]> {
    return MOCK_TOP_PRODUCTS.slice(0, limit);
  }

  async exportCSV(
    tipo: "vendas" | "categorias" | "produtos",
    inicio?: string,
    fim?: string
  ): Promise<string> {
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
        data.forEach((d) =>
          lines.push(`${d.sku};${d.produto};${d.quantidade};${d.receita}`)
        );
        return lines.join("\n");
      }
    }
  }
}
