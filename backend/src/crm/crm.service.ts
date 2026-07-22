import { Injectable, Logger } from "@nestjs/common";

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
  prioridade: "alta" | "media" | "baixa";
  criado_em: string;
  lido: boolean;
}

export interface TimelineEvent {
  id: string;
  tipo: "chat" | "pedido" | "orcamento" | "nota" | "ligacao" | "email" | "lead";
  descricao: string;
  data: string;
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

const CUSTOMERS: CustomerDetail[] = [
  { id: "1", nome: "Clínica OdontoPlus Ltda", cpf_cnpj: "12.345.678/0001-90", email: "contato@odontoplus.com.br", telefone: "(65) 3621-1000", segmento: "Clínica", status: "proposta", origem: "Site", total_gasto: 18340, ultima_compra: "2026-07-15", ticket_cluster: "medio", frequencia_cluster: "recorrente", categorias_compra: ["Restauradores", "Anestésicos"], vendedor_uid: "usr-001", vendedor_nome: "Carlos Vendas", ultimo_contato: "2026-07-20", proximo_contato: "2026-07-25", nota_interna: "Cliente interessado em novos equipamentos. Agendar visita.", propensao_compra: 78, churn_risk: "baixo", endereco: { logradouro: "Av. Historiador Rubens de Mendonça", numero: "3000", bairro: "Centro", cidade: "Cuiabá", estado: "MT", cep: "78000-000" }, criado_em: "2026-01-15T08:00:00" },
  { id: "2", nome: "Dr. Matheus Victor", cpf_cnpj: "123.456.789-00", email: "matheusvictorfernandesromeu4@gmail.com", telefone: "(65) 99999-0001", segmento: "Consultório", status: "cliente", origem: "WhatsApp", total_gasto: 8900, ultima_compra: "2026-07-18", ticket_cluster: "medio", frequencia_cluster: "recorrente", categorias_compra: ["Restauradores", "Adesivos"], vendedor_uid: "usr-001", vendedor_nome: "Carlos Vendas", ultimo_contato: "2026-07-19", proximo_contato: null, nota_interna: "Cliente fiel. Preferência por resinas Z350.", propensao_compra: 85, churn_risk: "baixo", endereco: { logradouro: "Rua Comandante Costa", numero: "500", bairro: "Centro", cidade: "Cuiabá", estado: "MT", cep: "78010-000" }, criado_em: "2026-02-20T10:30:00" },
  { id: "3", nome: "Sorriso Perfeito Odontologia", cpf_cnpj: "98.765.432/0001-10", email: "adm@sorisoperfeito.com.br", telefone: "(65) 3622-2000", segmento: "Clínica", status: "cliente", origem: "Indicação", total_gasto: 42000, ultima_compra: "2026-07-10", ticket_cluster: "grande", frequencia_cluster: "recorrente", categorias_compra: ["Instrumentais", "Equipamentos", "Anestésicos"], vendedor_uid: "usr-002", vendedor_nome: "Ana Operadora", ultimo_contato: "2026-07-12", proximo_contato: "2026-08-01", nota_interna: "Cliente premium. Acompanhar manutenção de equipamentos.", propensao_compra: 92, churn_risk: "baixo", endereco: { logradouro: "Rua Barão de Melgaço", numero: "1500", bairro: "Centro", cidade: "Cuiabá", estado: "MT", cep: "78020-000" }, criado_em: "2025-11-01T14:00:00" },
  { id: "4", nome: "Dra. Ana Beatriz", cpf_cnpj: "987.654.321-00", email: "ana.beatriz@email.com", telefone: "(65) 99999-0002", segmento: "Consultório", status: "lead", origem: "Site", total_gasto: 3200, ultima_compra: "2026-06-20", ticket_cluster: "pequeno", frequencia_cluster: "sazonal", categorias_compra: ["Moldagem"], vendedor_uid: null, vendedor_nome: null, ultimo_contato: null, proximo_contato: null, nota_interna: null, propensao_compra: 45, churn_risk: "medio", endereco: { logradouro: "Av. República do Líbano", numero: "1200", bairro: "Alvorada", cidade: "Cuiabá", estado: "MT", cep: "78030-000" }, criado_em: "2026-04-10T09:15:00" },
  { id: "5", nome: "Faculdade de Odontologia UFMT", cpf_cnpj: "00.000.000/0001-91", email: "lab.odonto@ufmt.br", telefone: "(65) 3615-8000", segmento: "Instituição", status: "cliente", origem: "Licitação", total_gasto: 78500, ultima_compra: "2026-07-05", ticket_cluster: "grande", frequencia_cluster: "sazonal", categorias_compra: ["Equipamentos", "Instrumentais", "Biossegurança"], vendedor_uid: "usr-001", vendedor_nome: "Carlos Vendas", ultimo_contato: "2026-07-06", proximo_contato: "2026-08-15", nota_interna: "Licitação anual. Preparar proposta para 2027.", propensao_compra: 95, churn_risk: "baixo", endereco: { logradouro: "Av. Fernando Corrêa", numero: "2367", bairro: "Boa Esperança", cidade: "Cuiabá", estado: "MT", cep: "78060-000" }, criado_em: "2025-06-01T07:00:00" },
  { id: "6", nome: "Dr. Carlos Eduardo", cpf_cnpj: "456.789.123-00", email: "carlos.edu@email.com", telefone: "(65) 99999-0003", segmento: "Consultório", status: "lead", origem: "Indicação", total_gasto: 1200, ultima_compra: "2026-05-10", ticket_cluster: "pequeno", frequencia_cluster: "inativo", categorias_compra: ["Anestésicos"], vendedor_uid: null, vendedor_nome: null, ultimo_contato: null, proximo_contato: null, nota_interna: null, propensao_compra: 20, churn_risk: "alto", endereco: { logradouro: "Rua 13 de Junho", numero: "800", bairro: "Centro Norte", cidade: "Cuiabá", estado: "MT", cep: "78040-000" }, criado_em: "2026-05-01T11:00:00" },
  { id: "7", nome: "Dental Mais Distribuidora", cpf_cnpj: "11.222.333/0001-44", email: "compras@dentalmais.com.br", telefone: "(65) 3623-3000", segmento: "Distribuidor", status: "cliente", origem: "WhatsApp", total_gasto: 112000, ultima_compra: "2026-07-20", ticket_cluster: "grande", frequencia_cluster: "recorrente", categorias_compra: ["Todas as linhas"], vendedor_uid: "usr-002", vendedor_nome: "Ana Operadora", ultimo_contato: "2026-07-21", proximo_contato: "2026-07-28", nota_interna: "Parceiro estratégico. Negociar condições especiais.", propensao_compra: 98, churn_risk: "baixo", endereco: { logradouro: "Av. Dom Bosco", numero: "500", bairro: "Verdão", cidade: "Cuiabá", estado: "MT", cep: "78050-000" }, criado_em: "2025-03-15T16:00:00" },
  { id: "8", nome: "Dr. Renato Rosa", cpf_cnpj: "789.123.456-00", email: "gestor.renatorosa@gmail.com", telefone: "(65) 99999-0004", segmento: "Consultório", status: "negociacao", origem: "Site", total_gasto: 6700, ultima_compra: "2026-07-12", ticket_cluster: "medio", frequencia_cluster: "recorrente", categorias_compra: ["Restauradores", "Moldagem"], vendedor_uid: "usr-001", vendedor_nome: "Carlos Vendas", ultimo_contato: "2026-07-14", proximo_contato: "2026-07-24", nota_interna: "Negociando contrato anual. Potencial de upselling.", propensao_compra: 82, churn_risk: "baixo", endereco: { logradouro: "Rua Presidente Marques", numero: "200", bairro: "Centro", cidade: "Cuiabá", estado: "MT", cep: "78000-000" }, criado_em: "2026-01-05T13:45:00" },
];

const TIMELINE: TimelineEvent[] = [
  { id: "t1", tipo: "chat", descricao: "Cliente solicitou orçamento de resina composta", data: "2026-07-20T10:00:00", responsavel: "Chatbot" },
  { id: "t2", tipo: "orcamento", descricao: "Orçamento #ORC-001 enviado: 10x Resina Z350", data: "2026-07-20T10:05:00", responsavel: "Sistema" },
  { id: "t3", tipo: "ligacao", descricao: "Ligação de follow-up realizada. Cliente interessado.", data: "2026-07-20T14:00:00", responsavel: "Carlos Vendas" },
  { id: "t4", tipo: "nota", descricao: "Cliente prefere contato por WhatsApp. Adicionar ao grupo.", data: "2026-07-20T14:05:00", responsavel: "Carlos Vendas" },
  { id: "t5", tipo: "pedido", descricao: "Pedido #10482 criado — 10x Resina Composta", data: "2026-07-21T08:00:00", responsavel: "Sistema" },
  { id: "t6", tipo: "email", descricao: "Nota fiscal #NF-5678 enviada por email", data: "2026-07-21T09:00:00", responsavel: "Sistema" },
];

@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  async getClusters(): Promise<{ ticket: ClusterDistribution[]; frequencia: ClusterDistribution[]; segmento: ClusterDistribution[] }> {
    const ticket = this.aggregate(CUSTOMERS, "ticket_cluster");
    const frequencia = this.aggregate(CUSTOMERS, "frequencia_cluster");
    const segmento = this.aggregate(CUSTOMERS, "segmento");
    return { ticket, frequencia, segmento };
  }

  async getSalesAlerts(): Promise<SalesAlert[]> {
    const alerts: SalesAlert[] = [];
    let id = 0;

    for (const c of CUSTOMERS) {
      if (!c.vendedor_uid && c.status === "lead") {
        alerts.push({ id: String(++id), cliente_id: c.id, cliente_nome: c.nome, tipo: "lead_nao_atribuido", mensagem: `Lead "${c.nome}" não atribuído há ${Math.floor((Date.now() - new Date(c.criado_em).getTime()) / 86400000)} dias`, prioridade: "alta", criado_em: new Date().toISOString(), lido: false });
      }
      if (c.propensao_compra > 70 && (!c.ultimo_contato || (Date.now() - new Date(c.ultimo_contato).getTime()) > 3 * 86400000)) {
        alerts.push({ id: String(++id), cliente_id: c.id, cliente_nome: c.nome, tipo: "lead_sem_contato", mensagem: `Cliente "${c.nome}" sem contato há mais de 3 dias (propensão: ${c.propensao_compra}%)`, prioridade: "alta", criado_em: new Date().toISOString(), lido: false });
      }
      if (c.churn_risk === "alto") {
        alerts.push({ id: String(++id), cliente_id: c.id, cliente_nome: c.nome, tipo: "churn_alto", mensagem: `"${c.nome}" está com risco alto de churn (última compra: ${c.ultima_compra})`, prioridade: "alta", criado_em: new Date().toISOString(), lido: false });
      }
    }

    return alerts;
  }

  async getTimeline(customerId: string): Promise<TimelineEvent[]> {
    return TIMELINE;
  }

  async getCustomerById(id: string): Promise<CustomerDetail | null> {
    return CUSTOMERS.find((c) => c.id === id) || null;
  }

  async getCustomerOrders(customerId: string): Promise<any[]> {
    return [
      { id: "ORD-001", numero: "10482", data: "2026-07-21", status: "Separado", valor: 1544, itens: 2 },
      { id: "ORD-002", numero: "10478", data: "2026-06-15", status: "Entregue", valor: 890, itens: 1 },
    ];
  }

  async getCustomerEstimates(customerId: string): Promise<any[]> {
    return [
      { id: "EST-001", numero: "ORC-001", data: "2026-07-20", status: "enviado", valor: 1544, itens: 2 },
      { id: "EST-002", numero: "ORC-002", data: "2026-06-10", status: "aprovado", valor: 890, itens: 1 },
    ];
  }

  async addNote(customerId: string, texto: string, autor: string): Promise<TimelineEvent> {
    const event: TimelineEvent = { id: `n${Date.now()}`, tipo: "nota", descricao: texto, data: new Date().toISOString(), responsavel: autor };
    return event;
  }

  async assignVendor(customerId: string, vendedorUid: string, vendedorNome: string): Promise<CustomerDetail | null> {
    const c = CUSTOMERS.find((c) => c.id === customerId);
    if (!c) return null;
    c.vendedor_uid = vendedorUid;
    c.vendedor_nome = vendedorNome;
    return c;
  }

  private aggregate(data: CustomerDetail[], field: keyof CustomerDetail): ClusterDistribution[] {
    const map = new Map<string, { count: number; receita: number }>();
    for (const d of data) {
      const key = String(d[field]);
      const curr = map.get(key) || { count: 0, receita: 0 };
      curr.count++;
      curr.receita += d.total_gasto;
      map.set(key, curr);
    }
    return Array.from(map.entries()).map(([k, v]) => ({ tipo: k, rotulo: k.charAt(0).toUpperCase() + k.slice(1), quantidade: v.count, receita_total: v.receita }));
  }
}
