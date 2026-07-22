import { Injectable, Logger } from "@nestjs/common";
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
  ultimo_acesso: string | null;
  ativo: boolean;
}

export interface ActivityItem {
  tipo: "pedido" | "lead" | "campanha";
  descricao: string;
  tempo: string;
}

const MOCK_USERS: AdminUser[] = [
  { uid: "NcTtOuP9o6gPXDzHvsCHlG42AIm1", email: "matheusvictorfernandesromeu4@gmail.com", nome: "Matheus Victor", papel: "admin", ultimo_acesso: "2026-07-21T22:00:00", ativo: true },
  { uid: "uUIBiyMZyxNRN7irqO3aRdXqGqi1", email: "gestor.renatorosa@gmail.com", nome: "Renato Rosa", papel: "admin", ultimo_acesso: "2026-07-21T23:00:00", ativo: true },
  { uid: "usr-001", email: "vendas@dentalimperador.com.br", nome: "Carlos Vendas", papel: "manager", ultimo_acesso: "2026-07-20T14:00:00", ativo: true },
  { uid: "usr-002", email: "operador@dentalimperador.com.br", nome: "Ana Operadora", papel: "operator", ultimo_acesso: "2026-07-21T16:00:00", ativo: true },
];

const MOCK_ACTIVITY: ActivityItem[] = [
  { tipo: "pedido", descricao: "Pedido #10484 criado — Clínica Sorriso Perfeito", tempo: "2026-07-21T10:00:00" },
  { tipo: "lead", descricao: "Novo lead: Dra. Ana Beatriz (Consultório)", tempo: "2026-07-21T09:30:00" },
  { tipo: "campanha", descricao: "Campanha 'Reativação Inativos' disparada para 45 clientes", tempo: "2026-07-21T08:00:00" },
  { tipo: "pedido", descricao: "Pedido #10483 entregue — Consultório Dr. Matheus", tempo: "2026-07-20T17:00:00" },
  { tipo: "lead", descricao: "Lead convertido: Sorriso Perfeito Odontologia", tempo: "2026-07-20T15:00:00" },
  { tipo: "campanha", descricao: "Campanha 'SMS Promocional' agendada para 01/08", tempo: "2026-07-20T14:00:00" },
  { tipo: "pedido", descricao: "Separação concluída: Pedido #10482 (Resina Composta)", tempo: "2026-07-20T11:00:00" },
];

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private users = [...MOCK_USERS];
  private activity = [...MOCK_ACTIVITY];

  constructor(private cache: CacheService) {}

  async getMetrics(): Promise<AdminMetrics> {
    const cached = await this.cache.get<AdminMetrics>("admin:metrics");
    if (cached) return cached;

    const metrics: AdminMetrics = {
      faturamento_mes: 32000,
      variacao_faturamento: 14,
      total_pedidos_mes: 47,
      variacao_pedidos: 8,
      total_leads: 23,
      leads_novos_mes: 12,
      total_clientes: 48,
      taxa_churn: 18,
      ticket_medio: 1240,
      sla_entrega: 94,
      sla_resposta_chat: "1m 30s",
    };

    await this.cache.set("admin:metrics", metrics, 300);
    return metrics;
  }

  async getUsers(): Promise<AdminUser[]> {
    return this.users;
  }

  async updateUserRole(uid: string, papel: string): Promise<AdminUser> {
    const user = this.users.find((u) => u.uid === uid);
    if (!user) throw new Error(`Usuário ${uid} não encontrado`);
    user.papel = papel;
    return user;
  }

  async getActivity(limit = 10): Promise<ActivityItem[]> {
    return this.activity.slice(0, limit);
  }
}
