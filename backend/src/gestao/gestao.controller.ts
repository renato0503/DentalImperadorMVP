import { Controller, Get, Post, Param, Body, Logger } from "@nestjs/common";
import { Roles, Permissions } from "../auth/roles.decorator";
import { Public } from "../api-key/api-key.guard";
import { PrismaService } from "../prisma/prisma.service";

@Controller("gestao")
export class GestaoController {
  private readonly logger = new Logger(GestaoController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Get("dashboard")
  @Roles("GESTOR")
  @Permissions("gestao.ver_kpis")
  async getDashboard() {
    const [faturamento, pedidos, clientes] = await Promise.all([
      this.prisma.order.aggregate({ _sum: { valor_total: true } }),
      this.prisma.order.count(),
      this.prisma.user.count({ where: { role: "CLIENT", ativo: true } }),
    ]);

    return {
      faturamento_mes: Number(faturamento._sum.valor_total || 0),
      total_pedidos_mes: pedidos,
      total_clientes: clientes,
    };
  }

  @Get("crm/leads")
  @Roles("GESTOR")
  @Permissions("gestao.crm")
  async getLeads() {
    return this.prisma.user.findMany({
      where: { role: "CLIENT", status: "lead" },
      orderBy: { criado_em: "desc" },
      take: 50,
    });
  }

  @Get("equipe/metricas")
  @Roles("GESTOR")
  @Permissions("gestao.gerenciar_equipe")
  async getTeamMetrics() {
    const operators = await this.prisma.user.findMany({
      where: { role: "OPERATOR" },
    });

    return operators.map((op) => ({
      nome: op.nome,
      email: op.email,
      separacoes: 0,
    }));
  }

  @Get("relatorios/vendas")
  @Roles("GESTOR")
  @Permissions("gestao.ver_relatorios")
  async getSalesReport() {
    return this.prisma.order.findMany({
      orderBy: { criado_em: "desc" },
      take: 20,
      include: { items: true },
    });
  }

  @Post("equipe/atribuir")
  @Roles("GESTOR")
  @Permissions("gestao.gerenciar_equipe")
  async assignToTeam(@Body("userId") userId: string, @Body("teamId") teamId: string) {
    await this.prisma.user.update({
      where: { uid: userId },
      data: { teamId },
    });
    return { ok: true };
  }
}
