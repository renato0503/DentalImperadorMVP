import { useState, useEffect, useRef } from "react";
import {
  Chart, BarController, BarElement, CategoryScale, LinearScale,
  Tooltip, Legend, ArcElement, DoughnutController, LineController,
  LineElement, PointElement, Filler,
} from "chart.js";

Chart.register(
  BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend,
  ArcElement, DoughnutController, LineController, LineElement, PointElement, Filler
);

interface AdminMetrics {
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

interface AdminUser {
  uid: string; email: string; nome: string; papel: string; ultimo_acesso: string | null; ativo: boolean;
}

interface ActivityItem {
  tipo: "pedido" | "lead" | "campanha"; descricao: string; tempo: string;
}

const PAPEIS = ["admin", "manager", "operator", "cliente"];

const ACTIVITY_ICONS: Record<string, string> = { pedido: "📦", lead: "👤", campanha: "📨" };

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const barRef = useRef<HTMLCanvasElement>(null);
  const doughnutRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLCanvasElement>(null);

  const fetchData = async () => {
    try {
      const [m, u, a] = await Promise.all([
        fetch("/api/v1/admin/metrics").then((r) => r.json()),
        fetch("/api/v1/admin/users").then((r) => r.json()),
        fetch("/api/v1/admin/activity").then((r) => r.json()),
      ]);
      setMetrics(m);
      setUsers(Array.isArray(u) ? u : []);
      setActivities(Array.isArray(a) ? a : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!metrics || !barRef.current) return;

    const barCanvas = barRef.current;
    const doughnutCanvas = doughnutRef.current;
    const lineCanvas = lineRef.current;
    if (!barCanvas || !doughnutCanvas || !lineCanvas) return;

    new Chart(barCanvas, {
      type: "bar",
      data: {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
        datasets: [{
          label: "Vendas",
          data: [28, 31, 29, 35, 39, 43, 32],
          backgroundColor: "#00A650", borderRadius: 6,
        }],
      },
      options: {
        responsive: true, plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { callback: (v) => `R$${v}k` } } },
      },
    });

    new Chart(doughnutCanvas, {
      type: "doughnut",
      data: {
        labels: ["Ativos", "Inativos (30d)", "Risco Alto"],
        datasets: [{ data: [32, 8, 8], backgroundColor: ["#00A650", "#FFD700", "#E31E24"], borderWidth: 0 }],
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } },
    });

    new Chart(lineCanvas, {
      type: "line",
      data: {
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7"],
        datasets: [{
          label: "Churn %", data: [22, 20, 18, 16, 15, 14, 18],
          borderColor: "#E31E24", backgroundColor: "rgba(227,30,36,0.1)",
          fill: true, tension: 0.4, pointRadius: 4,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 30, ticks: { callback: (v) => `${v}%` } } },
      },
    });

    return () => { Chart.getChart(barCanvas)?.destroy(); Chart.getChart(doughnutCanvas)?.destroy(); Chart.getChart(lineCanvas)?.destroy(); };
  }, [metrics]);

  const changeRole = async (uid: string, papel: string) => {
    try {
      await fetch(`/api/v1/admin/users/${uid}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ papel }),
      });
      fetchData();
    } catch (e) { console.error(e); }
  };

  if (loading) return <p>Carregando painel admin...</p>;

  const fmt = (n: number) => `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>Painel Administrativo</h1>
          <p className="page-subtitle">Visão consolidada da plataforma Dental Imperador.</p>
        </div>
      </div>

      <div className="admin-grid">
        <div className="card metric-card">
          <h3>Faturamento</h3>
          <p className="metric-value">{fmt(metrics?.faturamento_mes || 0)}</p>
          <span className="metric-change positive">+{metrics?.variacao_faturamento}%</span>
        </div>
        <div className="card metric-card">
          <h3>Pedidos</h3>
          <p className="metric-value">{metrics?.total_pedidos_mes}</p>
          <span className="metric-change positive">+{metrics?.variacao_pedidos}%</span>
        </div>
        <div className="card metric-card">
          <h3>Clientes Ativos</h3>
          <p className="metric-value">{metrics?.total_clientes}</p>
        </div>
        <div className="card metric-card">
          <h3>Ticket Médio</h3>
          <p className="metric-value">{fmt(metrics?.ticket_medio || 0)}</p>
        </div>
        <div className="card metric-card">
          <h3>Leads Novos</h3>
          <p className="metric-value">{metrics?.leads_novos_mes}</p>
        </div>
        <div className="card metric-card">
          <h3>Taxa Churn</h3>
          <p className="metric-value" style={{ color: "var(--vermelho-dental)" }}>{metrics?.taxa_churn}%</p>
        </div>
      </div>

      <div className="admin-charts">
        <div className="card chart-card"><h3>Vendas (k)</h3><canvas ref={barRef} /></div>
        <div className="card chart-card"><h3>Clientes</h3><canvas ref={doughnutRef} /></div>
        <div className="card chart-card"><h3>Churn Semanal</h3><canvas ref={lineRef} /></div>
      </div>

      <div className="admin-section">
        <h2>SLA</h2>
        <div className="sla-grid">
          <div className="card sla-card">
            <div className="sla-value">{metrics?.sla_entrega}%</div>
            <div className="sla-label">Entregas no Prazo</div>
          </div>
          <div className="card sla-card">
            <div className="sla-value">{metrics?.sla_resposta_chat}</div>
            <div className="sla-label">Tempo Médio Chat</div>
          </div>
          <div className="card sla-card">
            <div className="sla-value">98%</div>
            <div className="sla-label">Uptime</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div className="card">
          <h2 style={{ marginBottom: 16, fontSize: 18 }}>Atividades Recentes</h2>
          <div className="activity-feed">
            {activities.map((a, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-icon ${a.tipo}`}>
                  {ACTIVITY_ICONS[a.tipo]}
                </div>
                <div className="activity-text">{a.descricao}</div>
                <span className="activity-time">
                  {new Date(a.tempo).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: 16, fontSize: 18 }}>Usuários</h2>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr><th>Nome</th><th>Email</th><th>Papel</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.uid}>
                    <td>{u.nome}</td>
                    <td style={{ fontSize: 13 }}>{u.email}</td>
                    <td>
                      <select
                        className="role-select"
                        value={u.papel}
                        onChange={(e) => changeRole(u.uid, e.target.value)}
                      >
                        {PAPEIS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
