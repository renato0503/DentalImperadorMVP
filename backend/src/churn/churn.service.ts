import { Injectable, Logger } from "@nestjs/common";

export interface ChurnRisk {
  cliente_id: string;
  cliente_nome: string;
  email: string;
  telefone: string;
  ultima_compra: string;
  dias_inativo: number;
  ticket_medio: number;
  total_gasto: number;
  score: "baixo" | "medio" | "alto";
  segmento: string;
}

export interface Campaign {
  id: string;
  nome: string;
  canal: "email" | "sms";
  publico_alvo: string;
  mensagem: string;
  status: "rascunho" | "agendada" | "enviada" | "concluida";
  agendada_para: string | null;
  enviada_em: string | null;
  total_destinatarios: number;
  total_convertidos: number;
  criado_em: string;
}

let MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    nome: "Reativação Inativos Julho",
    canal: "email",
    publico_alvo: "Clientes com +30 dias inativos",
    mensagem: "Olá! Sentimos sua falta. Confira ofertas especiais para você.",
    status: "enviada",
    agendada_para: null,
    enviada_em: "2026-07-15T10:00:00",
    total_destinatarios: 45,
    total_convertidos: 8,
    criado_em: "2026-07-10T08:00:00",
  },
  {
    id: "2",
    nome: "SMS Promocional Agosto",
    canal: "sms",
    publico_alvo: "Todos os leads",
    mensagem: "Dental Imperador: condições especiais este mês!",
    status: "agendada",
    agendada_para: "2026-08-01T09:00:00",
    enviada_em: null,
    total_destinatarios: 120,
    total_convertidos: 0,
    criado_em: "2026-07-20T14:00:00",
  },
  {
    id: "3",
    nome: "Black Friday Odonto",
    canal: "email",
    publico_alvo: "Todos os clientes",
    mensagem: "Semana Black Friday: até 40% off em produtos selecionados!",
    status: "rascunho",
    agendada_para: null,
    enviada_em: null,
    total_destinatarios: 0,
    total_convertidos: 0,
    criado_em: "2026-07-21T09:00:00",
  },
];

function calcularDiasInativo(ultimaCompra: string): number {
  const diff = Date.now() - new Date(ultimaCompra).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function calcularScore(dias: number): "baixo" | "medio" | "alto" {
  if (dias > 60) return "alto";
  if (dias > 30) return "medio";
  return "baixo";
}

@Injectable()
export class ChurnService {
  private readonly logger = new Logger(ChurnService.name);
  private campaigns = [...MOCK_CAMPAIGNS];

  async getChurnRisks(segmento?: string): Promise<ChurnRisk[]> {
    const customers = await this.getCustomersFromApi(segmento);
    return customers.map((c) => {
      const dias = calcularDiasInativo(c.ultima_compra);
      return {
        cliente_id: c.id,
        cliente_nome: c.nome,
        email: c.email,
        telefone: c.telefone,
        ultima_compra: c.ultima_compra,
        dias_inativo: dias,
        ticket_medio: c.total_gasto > 0 ? Math.round(c.total_gasto / Math.max(1, Math.ceil(dias / 30))) : 0,
        total_gasto: c.total_gasto,
        score: calcularScore(dias),
        segmento: c.segmento,
      };
    });
  }

  async getChurnSummary(): Promise<{
    total_clientes: number;
    risco_alto: number;
    risco_medio: number;
    risco_baixo: number;
    taxa_churn: number;
    ticket_medio_geral: number;
  }> {
    const risks = await this.getChurnRisks();
    const alto = risks.filter((r) => r.score === "alto").length;
    const medio = risks.filter((r) => r.score === "medio").length;
    const baixo = risks.filter((r) => r.score === "baixo").length;
    const mediaTicket =
      risks.reduce((s, r) => s + r.total_gasto, 0) / risks.length;

    return {
      total_clientes: risks.length,
      risco_alto: alto,
      risco_medio: medio,
      risco_baixo: baixo,
      taxa_churn: Math.round((alto / risks.length) * 100),
      ticket_medio_geral: Math.round(mediaTicket),
    };
  }

  async getCampaigns(): Promise<Campaign[]> {
    return this.campaigns;
  }

  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    const campaign: Campaign = {
      id: String(this.campaigns.length + 1),
      nome: data.nome || "Nova Campanha",
      canal: data.canal || "email",
      publico_alvo: data.publico_alvo || "",
      mensagem: data.mensagem || "",
      status: "rascunho",
      agendada_para: data.agendada_para || null,
      enviada_em: null,
      total_destinatarios: 0,
      total_convertidos: 0,
      criado_em: new Date().toISOString(),
    };
    this.campaigns.push(campaign);
    return campaign;
  }

  async triggerCampaign(id: string): Promise<Campaign> {
    const camp = this.campaigns.find((c) => c.id === id);
    if (!camp) throw new Error(`Campanha ${id} não encontrada`);

    const risks = await this.getChurnRisks();
    const destinatarios = risks.filter((r) => r.score === "alto" || r.score === "medio");

    camp.status = "enviada";
    camp.enviada_em = new Date().toISOString();
    camp.total_destinatarios = destinatarios.length;
    camp.total_convertidos = Math.round(destinatarios.length * 0.15);

    this.logger.log(
      `Campanha "${camp.nome}" disparada para ${destinatarios.length} clientes`
    );

    return camp;
  }

  private async getCustomersFromApi(segmento?: string): Promise<any[]> {
    const baseUrl = `http://localhost:${process.env.PORT || 3001}`;
    try {
      const url = segmento
        ? `${baseUrl}/api/v1/customers?segmento=${segmento}`
        : `${baseUrl}/api/v1/customers`;
      const res = await fetch(url);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      this.logger.warn("Não foi possível buscar customers da API, usando fallback mock");
      return [
        { id: "1", nome: "Clínica OdontoPlus", email: "contato@odontoplus.com.br", telefone: "(65) 3621-1000", ultima_compra: "2026-06-01", total_gasto: 18340, segmento: "Clínica" },
        { id: "2", nome: "Dr. Matheus Victor", email: "matheus@email.com", telefone: "(65) 99999-0001", ultima_compra: "2026-05-15", total_gasto: 8900, segmento: "Consultório" },
        { id: "3", nome: "Dra. Ana Beatriz", email: "ana@email.com", telefone: "(65) 99999-0002", ultima_compra: "2026-04-20", total_gasto: 3200, segmento: "Consultório" },
        { id: "4", nome: "Dr. Carlos Eduardo", email: "carlos@email.com", telefone: "(65) 99999-0003", ultima_compra: "2026-03-10", total_gasto: 1200, segmento: "Consultório" },
        { id: "5", nome: "Faculdade UFMT", email: "lab@ufmt.br", telefone: "(65) 3615-8000", ultima_compra: "2026-07-05", total_gasto: 78500, segmento: "Instituição" },
      ];
    }
  }
}
