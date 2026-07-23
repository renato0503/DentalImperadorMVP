import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface Notification {
  id: string;
  tipo: string;
  mensagem: string;
  prioridade: string;
  secao: string;
  lido: boolean;
  criado_em: Date;
  acao_url: string | null;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(secao?: string) {
    const where: any = {};
    if (secao) where.secao = secao;

    return this.prisma.notification.findMany({
      where,
      orderBy: { criado_em: "desc" },
    });
  }

  async getUnreadCount(secao?: string) {
    const unread = await this.prisma.notification.findMany({
      where: { lido: false },
    });

    const por_secao: Record<string, number> = {};
    for (const n of unread) {
      por_secao[n.secao] = (por_secao[n.secao] || 0) + 1;
    }
    const total = secao ? (por_secao[secao] || 0) : unread.length;
    return { total, por_secao };
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { lido: true },
    });
  }

  async markAllAsRead() {
    await this.prisma.notification.updateMany({
      data: { lido: true },
    });
  }
}
