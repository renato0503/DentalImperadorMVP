import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ManagerMetrics {
  faturamento_mes: number;
  total_pedidos_mes: number;
  ticket_medio: number;
  total_leads: number;
  leads_novos_mes: number;
  total_clientes: number;
}

export function ManagerDashboard() {
  const [metrics, setMetrics] = useState<ManagerMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/admin/metrics").then((r) => r.json()),
      fetch("/api/v1/crm/metrics/salesperson").then((r) => r.json()),
    ])
      .then(([adminMetrics]) => {
        setMetrics(adminMetrics);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando dashboard...</p>;

  const cards = [
    { label: "Faturamento do Mês", value: metrics ? `R$ ${metrics.faturamento_mes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "-", cor: "#00A650" },
    { label: "Pedidos no Mês", value: String(metrics?.total_pedidos_mes ?? "-"), cor: "#0066CC" },
    { label: "Ticket Médio", value: metrics ? `R$ ${metrics.ticket_medio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "-", cor: "#6B21A8" },
    { label: "Leads Novos", value: String(metrics?.leads_novos_mes ?? "-"), cor: "#E31E24" },
    { label: "Total Clientes", value: String(metrics?.total_clientes ?? "-"), cor: "#1a3a2e" },
  ];

  return (
    <div>
      <h1>Dashboard Comercial</h1>
      <p className="page-subtitle">Métricas da equipe de vendas.</p>

      <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {cards.map((c) => (
          <div key={c.label} className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{c.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: c.cor }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3>Ações Rápidas</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <button className="btn btn-outline" onClick={() => navigate("/manager/crm")}>Ver CRM</button>
            <button className="btn btn-outline" onClick={() => navigate("/manager/metricas")}>Métricas de Vendas</button>
            <button className="btn btn-outline" onClick={() => navigate("/manager/churn")}>Campanhas de Retenção</button>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3>Funil de Vendas</h3>
          <div style={{ marginTop: 12 }}>
            {[
              { label: "Leads", pct: 100, cor: "#E31E24" },
              { label: "Em Negociação", pct: 60, cor: "#F59E0B" },
              { label: "Proposta Enviada", pct: 35, cor: "#3B82F6" },
              { label: "Fechados", pct: 20, cor: "#00A650" },
            ].map((f) => (
              <div key={f.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span>{f.label}</span>
                  <span>{f.pct}%</span>
                </div>
                <div style={{ height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${f.pct}%`, background: f.cor, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
