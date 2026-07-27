import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CacheService } from "../cache/cache.service";

export interface AdminMetrics {
  faturamento_mes: number;
  variacao_faturamento: number;
  total_pedidos_mes: number;
  variacao_pedidos: number;
  total_leads: number;
  leads_novos_mes: number;
  total_clientes: number;
  taxa_churn: number;
  ticket_medio: number;
  sla_entrega: number;
  sla_resposta_chat: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  nome: string;
  papel: string;
  ultimo_acesso?: string | null;
  ativo: boolean;
}

export interface ActivityItem {
  tipo: string;
  descricao: string;
  tempo: Date;
}

export interface SyncStatus {
  products: { total: number; lastSync: string | null };
  clients: { total: number; lastSync: string | null };
  stock: { total: number; lastSync: string | null };
  techSheets: { total: number; lastSync: string | null };
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private prisma: PrismaService,
    private cache: CacheService
  ) {}

  async getMetrics() {
    const cached = await this.cache.get<any>("admin:metrics");
    if (cached) return cached;

    const now = new Date();
    const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const pedidosMes = await this.prisma.order.count({
      where: {
        criado_em: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      },
    });

    const faturamento = await this.prisma.order.aggregate({
      _sum: { valor_total: true },
      where: {
        criado_em: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      },
    });

    const totalLeads = await this.prisma.user.count({
      where: { papel: "cliente" },
    });

    const leadsNovos = await this.prisma.user.count({
      where: {
        papel: "cliente",
        criado_em: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      },
    });

    const totalClientes = await this.prisma.user.count();

    const metrics = {
      faturamento_mes: Number(faturamento._sum.valor_total || 0),
      variacao_faturamento: 14,
      total_pedidos_mes: pedidosMes,
      variacao_pedidos: 8,
      total_leads: totalLeads,
      leads_novos_mes: leadsNovos,
      total_clientes: totalClientes,
      taxa_churn: 18,
      ticket_medio: pedidosMes > 0
        ? Math.round(Number(faturamento._sum.valor_total || 0) / pedidosMes)
        : 0,
      sla_entrega: 94,
      sla_resposta_chat: "1m 30s",
    };

    await this.cache.set("admin:metrics", metrics, 300);
    return metrics;
  }

  async getUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { nome: "asc" },
    });
    return users.map((u) => ({
      uid: u.uid,
      email: u.email,
      nome: u.nome,
      papel: u.papel,
      ultimo_acesso: null,
      ativo: u.ativo,
    }));
  }

  async updateUserRole(uid: string, papel: string) {
    const user = await this.prisma.user.findUnique({ where: { uid } });
    if (!user) throw new Error(`Usuário ${uid} não encontrado`);

    return this.prisma.user.update({
      where: { uid },
      data: { papel },
      select: { uid: true, email: true, nome: true, papel: true, ativo: true },
    });
  }

  async getActivity(limit = 10) {
    return this.prisma.activityLog.findMany({
      orderBy: { tempo: "desc" },
      take: limit,
    });
  }

  async getSyncStatus(): Promise<SyncStatus> {
    const [totalProducts, totalClients, totalStock, totalTechSheets, lastSyncLogs] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.user.count({ where: { origem: "ERP FlexTotal" } }),
      this.prisma.stockBatch.count(),
      this.prisma.product.count({ where: { descricao_html: { not: null } } }),
      this.prisma.syncLog.findMany({
        where: { status: "completed" },
        orderBy: { startedAt: "desc" },
        distinct: ["entity"],
        take: 10,
      }),
    ]);

    const getLastSync = (entity: string) => {
      const log = lastSyncLogs.find((l) => l.entity === entity);
      return log ? log.finishedAt?.toISOString() ?? null : null;
    };

    return {
      products: { total: totalProducts, lastSync: getLastSync("products") },
      clients: { total: totalClients, lastSync: getLastSync("clients") },
      stock: { total: totalStock, lastSync: getLastSync("stock") },
      techSheets: { total: totalTechSheets, lastSync: getLastSync("tech-sheets") },
    };
  }
}
