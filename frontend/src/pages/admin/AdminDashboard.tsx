import { useState, useEffect, useRef } from "react";
import {
  Chart, BarController, BarElement, CategoryScale, LinearScale,
  Tooltip, Legend, ArcElement, DoughnutController, LineController,
  LineElement, PointElement, Filler,
} from "chart.js";
import { showToast } from "../../lib/toast";
import { useSyncStatus, formatSyncTime } from "../../hooks/useSync";

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

interface SalesMonth {
  mes: string;
  total: number;
}

interface SegmentItem {
  segmento: string;
  quantidade: number;
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
  const [salesHistory, setSalesHistory] = useState<SalesMonth[]>([]);
  const [segments, setSegments] = useState<SegmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { statuses, fetchLastSync } = useSyncStatus();
  const barRef = useRef<HTMLCanvasElement>(null);
  const doughnutRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLCanvasElement>(null);
  const barChart = useRef<Chart | null>(null);
  const doughnutChart = useRef<Chart | null>(null);
  const lineChart = useRef<Chart | null>(null);

  const fetchData = async () => {
    try {
      const [m, u, a, s, seg] = await Promise.all([
        fetch("/api/v1/admin/metrics").then((r) => r.json()),
        fetch("/api/v1/admin/users").then((r) => r.json()),
        fetch("/api/v1/admin/activity").then((r) => r.json()),
        fetch("/api/v1/admin/sales-history").then((r) => r.json()),
        fetch("/api/v1/admin/segment-stats").then((r) => r.json()),
      ]);
      setMetrics(m);
      setUsers(Array.isArray(u) ? u : []);
      setActivities(Array.isArray(a) ? a : []);
      setSalesHistory(Array.isArray(s) ? s : []);
      setSegments(Array.isArray(seg) ? seg : []);
    } catch (e) {
      console.error("Erro admin dashboard:", e);
      showToast("Erro ao carregar dados do admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const entities = ["products", "clients", "stock", "tech-sheets"];
    entities.forEach(fetchLastSync);
    const interval = setInterval(() => entities.forEach(fetchLastSync), 30000);
    return () => clearInterval(interval);
  }, [fetchLastSync]);

  useEffect(() => {
    if (!barRef.current || salesHistory.length === 0) return;
    if (barChart.current) barChart.current.destroy();
    barChart.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: salesHistory.map((s) => s.mes),
        datasets: [{
          label: "Vendas",
          data: salesHistory.map((s) => Math.round(s.total / 1000)),
          backgroundColor: "#00A650", borderRadius: 6,
        }],
      },
      options: {
        responsive: true, plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { callback: (v) => `R$${v}k` } } },
      },
    });
  }, [salesHistory]);

  useEffect(() => {
    if (!doughnutRef.current || segments.length === 0) return;
    if (doughnutChart.current) doughnutChart.current.destroy();
    doughnutChart.current = new Chart(doughnutRef.current, {
      type: "doughnut",
      data: {
        labels: segments.map((s) => s.segmento),
        datasets: [{
          data: segments.map((s) => s.quantidade),
          backgroundColor: ["#00A650", "#FFD700", "#E31E24", "#007A3D", "#6B7280"],
          borderWidth: 0,
        }],
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } },
    });
  }, [segments]);

  useEffect(() => {
    if (!lineRef.current) return;
    if (lineChart.current) lineChart.current.destroy();
    lineChart.current = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7"],
        datasets: [{
          label: "Churn %",
          data: [22, 20, 18, 16, 15, 14, 18],
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
  }, []);

  useEffect(() => {
    return () => {
      if (barChart.current) barChart.current.destroy();
      if (doughnutChart.current) doughnutChart.current.destroy();
      if (lineChart.current) lineChart.current.destroy();
    };
  }, []);

  const changeRole = async (uid: string, papel: string) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${uid}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ papel }),
      });
      if (!res.ok) console.error("Erro changeRole:", res.status, await res.text());
      fetchData();
    } catch (e) { console.error("changeRole error:", e); }
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

      <div className="admin-section">
        <h2>Sincronia ERP</h2>
        <div className="sla-grid">
          {[
            { entity: "products", label: "Produtos" },
            { entity: "clients", label: "Clientes" },
            { entity: "stock", label: "Estoque" },
            { entity: "tech-sheets", label: "Fichas Técnicas" },
          ].map(({ entity, label }) => {
            const entry = statuses[entity];
            const ok = entry?.status === "completed" && entry?.result?.success;
            return (
              <div key={entity} className="card sla-card">
                <div className="sla-value" style={{ fontSize: 12, color: ok ? "#00A650" : "#9CA3AF" }}>
                  {ok ? "✅" : "⏳"}
                </div>
                <div className="sla-label">{label}</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                  {entry ? `${formatSyncTime(entry.finishedAt)} — ${entry.result?.recordsProcessed.toLocaleString()} itens` : "Nunca"}
                </div>
              </div>
            );
          })}
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
