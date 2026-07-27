import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface ClusterDistribution {
  tipo: string;
  rotulo: string;
  quantidade: number;
  receita_total: number;
}

export interface SalesAlert {
  id: string;
  cliente_id: string;
  cliente_nome: string;
  tipo: string;
  mensagem: string;
  prioridade: string;
  criado_em: string;
  lido: boolean;
}

export interface TimelineEvent {
  id: string;
  cliente_uid: string;
  tipo: string;
  descricao: string;
  data: Date;
  responsavel: string;
}

export interface CustomerDetail {
  id: string;
  nome: string;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  segmento: string;
  status: string;
  origem: string;
  total_gasto: number;
  ultima_compra: string;
  ticket_cluster: string;
  frequencia_cluster: string;
  categorias_compra: string[];
  vendedor_uid: string | null;
  vendedor_nome: string | null;
  ultimo_contato: string | null;
  proximo_contato: string | null;
  nota_interna: string | null;
  propensao_compra: number;
  churn_risk: string;
  endereco: { logradouro: string; numero: string; bairro: string; cidade: string; estado: string; cep: string };
  criado_em: string;
}

function toCustomerDetail(user: any) {
  let enderecoObj = {
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  };
  if (user.endereco) {
    try {
      enderecoObj = JSON.parse(user.endereco);
    } catch {}
  }

  return {
    id: user.id,
    nome: user.nome,
    cpf_cnpj: user.cpf_cnpj || "",
    email: user.email,
    telefone: user.telefone || "",
    segmento: user.segmento || "",
    status: user.status || user.role,
    origem: user.origem || "",
    total_gasto: user.total_gasto || 0,
    ultima_compra: user.ultima_compra
      ? user.ultima_compra.toISOString().split("T")[0]
      : "",
    ticket_cluster: user.ticket_cluster || "",
    frequencia_cluster: user.frequencia_cluster || "",
    categorias_compra: [],
    vendedor_uid: user.vendedor_uid || null,
    vendedor_nome: user.vendedor_nome || null,
    ultimo_contato: user.ultimo_contato
      ? user.ultimo_contato.toISOString().split("T")[0]
      : null,
    proximo_contato: user.proximo_contato
      ? user.proximo_contato.toISOString().split("T")[0]
      : null,
    nota_interna: user.nota_interna || null,
    propensao_compra: user.propensao_compra || 0,
    churn_risk: user.churn_risk || "baixo",
    endereco: enderecoObj,
    criado_em: user.criado_em
      ? user.criado_em.toISOString()
      : new Date().toISOString(),
  };
}

@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  constructor(private prisma: PrismaService) {}

  async getClusters() {
    const users = await this.prisma.user.findMany();

    const aggregate = (field: string) => {
      const map = new Map<string, { count: number; receita: number }>();
      for (const u of users) {
        const key = String((u as any)[field] || "desconhecido");
        const curr = map.get(key) || { count: 0, receita: 0 };
        curr.count++;
        curr.receita += u.total_gasto || 0;
        map.set(key, curr);
      }
      return Array.from(map.entries()).map(([k, v]) => ({
        tipo: k,
        rotulo: k.charAt(0).toUpperCase() + k.slice(1),
        quantidade: v.count,
        receita_total: v.receita,
      }));
    };

    return {
      ticket: aggregate("ticket_cluster"),
      frequencia: aggregate("frequencia_cluster"),
      segmento: aggregate("segmento"),
    };
  }

  async getSalesAlerts() {
    const customers = await this.prisma.user.findMany();
    const alerts: any[] = [];
    let id = 0;

    for (const c of customers) {
      if (!c.vendedor_uid && c.role !== "GESTOR") {
        alerts.push({
          id: String(++id),
          cliente_id: c.id,
          cliente_nome: c.nome,
          tipo: "lead_nao_atribuido",
          mensagem: `Lead "${c.nome}" não atribuído`,
          prioridade: "alta",
          criado_em: new Date().toISOString(),
          lido: false,
        });
      }
    }

    return alerts;
  }

  async getTimeline(customerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
    });
    if (!user) return [];

    return this.prisma.timelineEvent.findMany({
      where: { cliente_uid: user.uid },
      orderBy: { data: "desc" },
    });
  }

  async getCustomerById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return toCustomerDetail(user);
  }

  async getCustomerOrders(customerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
    });
    if (!user) return [];

    const orders = await this.prisma.order.findMany({
      where: { cliente_uid: user.uid },
      include: {
        items: {
          include: { product: { select: { nome: true } } },
        },
      },
      orderBy: { criado_em: "desc" },
    });

    return orders.map((o) => ({
      id: o.id,
      numero: o.numero,
      data: o.criado_em?.toISOString().split("T")[0] || "",
      status: o.status,
      valor: Number(o.valor_total || 0),
      itens: o.items.length,
    }));
  }

  async getCustomerEstimates(customerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
    });
    if (!user) return [];

    const estimates = await this.prisma.estimate.findMany({
      where: { cliente_uid: user.uid },
      orderBy: { criado_em: "desc" },
    });

    return estimates.map((e) => ({
      id: e.id,
      data: e.criado_em?.toISOString().split("T")[0] || "",
      status: e.status,
      valor: Number(e.valor_total || 0),
      itens: e.items ? JSON.parse(e.items).length : 0,
    }));
  }

  async addNote(customerId: string, texto: string, autor: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
    });
    if (!user) throw new Error("Cliente não encontrado");

    const event = await this.prisma.timelineEvent.create({
      data: {
        cliente_uid: user.uid,
        tipo: "nota",
        descricao: texto,
        responsavel: autor,
        data: new Date(),
      },
    });

    await this.prisma.user.update({
      where: { id: customerId },
      data: { nota_interna: texto },
    });

    return event;
  }

  async assignVendor(
    customerId: string,
    vendedorUid: string,
    vendedorNome: string
  ) {
    const user = await this.prisma.user.update({
      where: { id: customerId },
      data: {
        vendedor_uid: vendedorUid,
        vendedor_nome: vendedorNome,
      },
    });

    await this.prisma.timelineEvent.create({
      data: {
        cliente_uid: user.uid,
        tipo: "nota",
        descricao: `Vendedor atribuído: ${vendedorNome}`,
        responsavel: "Sistema",
      },
    });

    return toCustomerDetail(user);
  }

  async getSalespersonMetrics() {
    const customers = await this.prisma.user.findMany();

    const vendors = new Map<
      string,
      {
        nome: string;
        leads: number;
        clientes: number;
        receita: number;
      }
    >();

    for (const c of customers) {
      if (!c.vendedor_uid) continue;
      const v = vendors.get(c.vendedor_uid) || {
        nome: c.vendedor_nome || "—",
        leads: 0,
        clientes: 0,
        receita: 0,
      };
      v.leads++;
      if (c.role === "CLIENT") v.clientes++;
      v.receita += c.total_gasto || 0;
      vendors.set(c.vendedor_uid, v);
    }

    return Array.from(vendors.entries()).map(([uid, v]) => ({
      vendedor_uid: uid,
      ...v,
      ticket_medio: v.clientes > 0 ? Math.round(v.receita / v.clientes) : 0,
      conversao: v.leads > 0 ? Math.round((v.clientes / v.leads) * 100) : 0,
    }));
  }

  async getPipelineMetrics() {
    const etapas = ["lead", "contato", "proposta", "negociacao", "cliente"];
    const users = await this.prisma.user.findMany();

    return etapas.map((etapa) => {
      const filtered = users.filter(
        (u) => u.status === etapa
      );
      return {
        etapa,
        quantidade: filtered.length,
        valor: filtered.reduce((s, u) => s + (u.total_gasto || 0), 0),
      };
    });
  }

  async getForecast() {
    const customers = await this.prisma.user.findMany();
    const leadsQuentes = customers.filter(
      (c) => (c.propensao_compra || 0) > 70
    );
    const receita = leadsQuentes.reduce(
      (s, c) => s + (c.total_gasto || 5000),
      0
    );
    const probMedia =
      leadsQuentes.length > 0
        ? Math.round(
            leadsQuentes.reduce((s, c) => s + (c.propensao_compra || 0), 0) /
              leadsQuentes.length
          )
        : 0;

    return {
      receita_projetada: receita,
      probabilidade_media: probMedia,
      leads_quentes: leadsQuentes.length,
    };
  }

  private vendorPool = [
    { uid: "usr-001", nome: "Carlos Vendas" },
    { uid: "usr-002", nome: "Ana Operadora" },
  ];
  private roundRobinIndex = 0;

   async autoCreateLead(data: {
    nome: string;
    email: string;
    telefone: string;
    tipo_solicitacao: string;
    origem?: string;
    lista_academica?: boolean;
  }) {
    const vendor = this.vendorPool[this.roundRobinIndex];
    this.roundRobinIndex =
      (this.roundRobinIndex + 1) % this.vendorPool.length;

    const acad = data.lista_academica ? "SIM" : "NÃO";
    const user = await this.prisma.user.upsert({
      where: { email: data.email },
      update: {
        nome: data.nome,
        telefone: data.telefone,
        origem: data.origem || "Chatbot",
        vendedor_uid: vendor.uid,
        vendedor_nome: vendor.nome,
        ultimo_contato: new Date(),
        nota_interna: `Lead atualizado via chatbot. Solicitação: ${data.tipo_solicitacao}. Lista acadêmica: ${acad}`,
      },
      create: {
        uid: `lead-${Date.now()}`,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        role: "CLIENT",
        origem: data.origem || "Chatbot",
        vendedor_uid: vendor.uid,
        vendedor_nome: vendor.nome,
        ultimo_contato: new Date(),
        ticket_cluster: "pequeno",
        frequencia_cluster: "inativo",
        propensao_compra: 50,
        churn_risk: "medio",
        nota_interna: `Lead criado via chatbot. Solicitação: ${data.tipo_solicitacao}. Lista acadêmica: ${acad}`,
      },
    });

    await this.prisma.timelineEvent.create({
      data: {
        cliente_uid: user.uid,
        tipo: "lead",
        descricao: `Lead criado via chatbot. Vendedor atribuído: ${vendor.nome}. Solicitação: ${data.tipo_solicitacao}`,
        responsavel: "Chatbot",
      },
    });

    this.logger.log(
      `Lead criado: ${user.nome} → ${vendor.nome} (round-robin)`
    );
    return { lead: toCustomerDetail(user), vendedor_nome: vendor.nome };
  }

  async whatsappIncoming(data: {
    numero: string;
    mensagem: string;
    nome?: string;
  }) {
    const existing = await this.prisma.user.findFirst({
      where: { telefone: data.numero },
    });

    if (existing) {
      await this.prisma.timelineEvent.create({
        data: {
          cliente_uid: existing.uid,
          tipo: "chat",
          descricao: `Mensagem WhatsApp recebida: "${data.mensagem.substring(
            0,
            100
          )}"`,
          responsavel: data.nome || "WhatsApp",
        },
      });
      this.logger.log(
        `WhatsApp: mensagem de cliente existente ${existing.nome}`
      );
      return { cliente: toCustomerDetail(existing), acao: "mensagem_associada" };
    }

    const vendor = this.vendorPool[this.roundRobinIndex];
    this.roundRobinIndex =
      (this.roundRobinIndex + 1) % this.vendorPool.length;

    const user = await this.prisma.user.create({
      data: {
        uid: `whatsapp-${Date.now()}`,
        nome: data.nome || `Contato WhatsApp ${data.numero}`,
        email: "",
        telefone: data.numero,
        role: "CLIENT",
        origem: "WhatsApp",
        vendedor_uid: vendor.uid,
        vendedor_nome: vendor.nome,
        ultimo_contato: new Date(),
        ticket_cluster: "pequeno",
        frequencia_cluster: "inativo",
        propensao_compra: 50,
        churn_risk: "medio",
        nota_interna: `Lead criado via WhatsApp. Mensagem: "${data.mensagem.substring(
          0,
          200
        )}"`,
      },
    });

    await this.prisma.timelineEvent.create({
      data: {
        cliente_uid: user.uid,
        tipo: "lead",
        descricao: `Lead criado via WhatsApp Webhook. Vendedor: ${vendor.nome}`,
        responsavel: "WhatsApp",
      },
    });

    this.logger.log(`WhatsApp: novo lead criado ${user.nome} → ${vendor.nome}`);
    return { cliente: toCustomerDetail(user), acao: "lead_criado" };
  }
}
