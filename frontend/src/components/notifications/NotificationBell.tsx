import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../hooks/useNotifications";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const PRIO_ICON: Record<string, string> = { alta: "🔴", media: "🟡", baixa: "🟢" };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="theme-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Notificações"
        style={{ position: "relative" }}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <strong>Notificações</strong>
            {notifications.length > 0 && (
              <button className="btn btn-sm btn-outline" style={{ fontSize: 11, padding: "2px 8px" }}
                onClick={async () => {
                  await fetch("/api/v1/notifications/read-all", { method: "PATCH" });
                  window.location.reload();
                }}>
                Limpar todas
              </button>
            )}
          </div>
          <div className="notif-list">
            {notifications.length === 0 && (
              <p style={{ padding: 20, textAlign: "center", color: "var(--cinza-medio)", fontSize: 13 }}>
                Nenhuma notificação
              </p>
            )}
            {notifications.map((n) => (
              <div key={n.id} className={`notif-item${n.lido ? "" : " unread"}`}
                onClick={() => {
                  markAsRead(n.id);
                  if (n.acao_url) window.location.href = n.acao_url;
                }}>
                <span className="notif-prio">{PRIO_ICON[n.prioridade] || "🔵"}</span>
                <div className="notif-content">
                  <p>{n.mensagem}</p>
                  <span className="notif-time">{new Date(n.criado_em).toLocaleString("pt-BR")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
