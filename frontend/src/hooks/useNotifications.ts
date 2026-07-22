import { useState, useEffect, useCallback } from "react";

export interface Notification {
  id: string; tipo: string; mensagem: string; prioridade: string;
  secao: string; lido: boolean; criado_em: string; acao_url: string | null;
}

export function useNotifications(secao?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const params = secao ? `?secao=${secao}` : "";
      const [notifRes, countRes] = await Promise.all([
        fetch(`/api/v1/notifications${params}`).then((r) => r.json()),
        fetch("/api/v1/notifications/unread-count").then((r) => r.json()),
      ]);
      setNotifications(Array.isArray(notifRes) ? notifRes : []);
      setUnreadCount(countRes?.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [secao]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const markAsRead = async (id: string) => {
    await fetch(`/api/v1/notifications/${id}/read`, { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lido: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return { notifications, unreadCount, loading, markAsRead, refresh: fetchAll };
}
