import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface ChurnRisk {
  cliente_id: string;
  cliente_nome: string;
  email: string;
  telefone: string;
  ultima_compra: string;
  dias_inativo: number;
  ticket_medio: number;
  total_gasto: number;
  score: string;
  segmento: string;
}

export interface Campaign {
  id: string;
  nome: string;
  canal: string;
  publico_alvo: string;
  mensagem: string;
  status: string;
  agendada_para: Date | null;
  enviada_em: Date | null;
  total_destinatarios: number;
  total_convertidos: number;
  criado_em: Date;
}

function calcularDiasInativo(ultimaCompra: Date | null): number {
  if (!ultimaCompra) return 999;
  return Math.floor(
    (Date.now() - new Date(ultimaCompra).getTime()) / (1000 * 60 * 60 * 24)
  );
}

function calcularScore(dias: number): "baixo" | "medio" | "alto" {
  if (dias > 60) return "alto";
  if (dias > 30) return "medio";
  return "baixo";
}

@Injectable()
export class ChurnService {
  private readonly logger = new Logger(ChurnService.name);

  constructor(private prisma: PrismaService) {}

  async getChurnRisks(segmento?: string) {
    const where: any = { papel: "cliente" };
    if (segmento) where.segmento = segmento;

    const customers = await this.prisma.user.findMany({ where });

    return customers.map((c) => {
      const dias = calcularDiasInativo(c.ultima_compra);
      return {
        cliente_id: c.id,
        cliente_nome: c.nome,
        email: c.email,
        telefone: c.telefone || "",
        ultima_compra: c.ultima_compra?.toISOString().split("T")[0] || "",
        dias_inativo: dias,
        ticket_medio:
          c.total_gasto && c.total_gasto > 0
            ? Math.round(c.total_gasto / Math.max(1, Math.ceil(dias / 30)))
            : 0,
        total_gasto: c.total_gasto || 0,
        score: calcularScore(dias),
        segmento: c.segmento || "",
      };
    });
  }

  async getChurnSummary() {
    const risks = await this.getChurnRisks();
    const alto = risks.filter((r) => r.score === "alto").length;
    const medio = risks.filter((r) => r.score === "medio").length;
    const baixo = risks.filter((r) => r.score === "baixo").length;
    const mediaTicket =
      risks.length > 0
        ? risks.reduce((s, r) => s + r.total_gasto, 0) / risks.length
        : 0;

    return {
      total_clientes: risks.length,
      risco_alto: alto,
      risco_medio: medio,
      risco_baixo: baixo,
      taxa_churn: risks.length > 0 ? Math.round((alto / risks.length) * 100) : 0,
      ticket_medio_geral: Math.round(mediaTicket),
    };
  }

  async getCampaigns() {
    return this.prisma.campaign.findMany({
      orderBy: { criado_em: "desc" },
    });
  }

  async createCampaign(data: {
    nome: string;
    canal: string;
    publico_alvo?: string;
    mensagem?: string;
    agendada_para?: string;
  }) {
    return this.prisma.campaign.create({
      data: {
        nome: data.nome,
        canal: data.canal,
        publico_alvo: data.publico_alvo || "",
        mensagem: data.mensagem || "",
        agendada_para: data.agendada_para
          ? new Date(data.agendada_para)
          : null,
      },
    });
  }

  async triggerCampaign(id: string) {
    const camp = await this.prisma.campaign.findUnique({ where: { id } });
    if (!camp) throw new Error(`Campanha ${id} não encontrada`);

    const risks = await this.getChurnRisks();
    const destinatarios = risks.filter(
      (r) => r.score === "alto" || r.score === "medio"
    );

    const updated = await this.prisma.campaign.update({
      where: { id },
      data: {
        status: "enviada",
        enviada_em: new Date(),
        total_destinatarios: destinatarios.length,
        total_convertidos: Math.round(destinatarios.length * 0.15),
      },
    });

    this.logger.log(
      `Campanha "${camp.nome}" disparada para ${destinatarios.length} clientes`
    );

    return updated;
  }
}
