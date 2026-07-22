import { Injectable, Logger } from "@nestjs/common";

export interface Notification {
  id: string;
  tipo: string;
  mensagem: string;
  prioridade: "alta" | "media" | "baixa";
  secao: string;
  lido: boolean;
  criado_em: string;
  acao_url: string | null;
}

const MOCK: Notification[] = [
  { id: "n1", tipo: "lead_nao_atribuido", mensagem: "Dra. Ana Beatriz aguarda atribuição há 2 dias", prioridade: "alta", secao: "CRM", lido: false, criado_em: "2026-07-22T08:00:00", acao_url: "/crm" },
  { id: "n2", tipo: "lead_sem_contato", mensagem: "Dr. Carlos Eduardo sem contato há 5 dias (propensão 20%)", prioridade: "alta", secao: "CRM", lido: false, criado_em: "2026-07-22T07:00:00", acao_url: "/crm" },
  { id: "n3", tipo: "churn_alto", mensagem: "Dr. Carlos Eduardo está em risco alto de churn", prioridade: "alta", secao: "CRM", lido: false, criado_em: "2026-07-22T06:00:00", acao_url: "/crm/cliente/6" },
  { id: "n4", tipo: "proposta_sem_retorno", mensagem: "Proposta para Clínica OdontoPlus aguarda retorno há 6 dias", prioridade: "media", secao: "CRM", lido: true, criado_em: "2026-07-21T10:00:00", acao_url: "/crm/cliente/1" },
  { id: "n5", tipo: "pedido_parado", mensagem: "Pedido #10484 parado na separação (2 dias)", prioridade: "alta", secao: "Operações", lido: false, criado_em: "2026-07-22T05:00:00", acao_url: "/picking" },
  { id: "n6", tipo: "campanha_pronta", mensagem: "Campanha 'Black Friday' está em rascunho", prioridade: "baixa", secao: "CRM", lido: false, criado_em: "2026-07-21T15:00:00", acao_url: "/campanhas" },
];

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private notifications = [...MOCK];

  async findAll(secao?: string): Promise<Notification[]> {
    let result = [...this.notifications];
    if (secao) result = result.filter((n) => n.secao === secao);
    return result.sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime());
  }

  async getUnreadCount(secao?: string): Promise<{ total: number; por_secao: Record<string, number> }> {
    const unread = this.notifications.filter((n) => !n.lido);
    const por_secao: Record<string, number> = {};
    for (const n of unread) {
      por_secao[n.secao] = (por_secao[n.secao] || 0) + 1;
    }
    const total = secao ? (por_secao[secao] || 0) : unread.length;
    return { total, por_secao };
  }

  async markAsRead(id: string): Promise<Notification | null> {
    const n = this.notifications.find((n) => n.id === id);
    if (n) n.lido = true;
    return n || null;
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach((n) => (n.lido = true));
  }
}
