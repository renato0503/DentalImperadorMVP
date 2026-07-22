import { useState, useEffect, useRef } from "react";
import {
  Chart, BarController, BarElement, CategoryScale, LinearScale,
  Tooltip, Legend,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface SalespersonMetric {
  vendedor_uid: string; nome: string; leads: number; clientes: number;
  receita: number; ticket_medio: number; conversao: number;
}

interface PipelineStage {
  etapa: string; quantidade: number; valor: number;
}

interface Forecast {
  receita_projetada: number; probabilidade_media: number; leads_quentes: number;
}

const ETAPA_LABEL: Record<string, string> = {
  lead: "Leads", contato: "Contato", proposta: "Proposta",
  negociacao: "Negociação", cliente: "Clientes",
};

export function SalesMetricsPage() {
  const [salespeople, setSalespeople] = useState<SalespersonMetric[]>([]);
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);
  const funnelRef = useRef<HTMLCanvasElement>(null);
  const chart = useRef<Chart | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/crm/metrics/salesperson").then((r) => r.json()),
      fetch("/api/v1/crm/metrics/pipeline").then((r) => r.json()),
      fetch("/api/v1/crm/metrics/forecast").then((r) => r.json()),
    ]).then(([s, p, f]) => {
      setSalespeople(Array.isArray(s) ? s : []);
      setPipeline(Array.isArray(p) ? p : []);
      setForecast(f);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!pipeline.length || !funnelRef.current) return;
    if (chart.current) chart.current.destroy();
    chart.current = new Chart(funnelRef.current, {
      type: "bar",
      data: {
        labels: pipeline.map((p) => ETAPA_LABEL[p.etapa] || p.etapa),
        datasets: [{
          label: "Leads",
          data: pipeline.map((p) => p.quantidade),
          backgroundColor: ["#FEF3C7", "#DBEAFE", "#E0E7FF", "#FCE7F3", "#D1FAE5"],
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        indexAxis: "y",
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    });
    return () => { if (chart.current) chart.current.destroy(); };
  }, [pipeline]);

  if (loading) return <p>Carregando métricas...</p>;

  return (
    <div className="page page-sales-metrics">
      <div className="page-header-row">
        <div>
          <h1>Métricas de Vendas</h1>
          <p className="page-subtitle">Performance do time e projeções de receita.</p>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 24 }}>
        <div className="card metric-card">
          <h3>📈 Receita Projetada</h3>
          <p className="metric-value">R$ {forecast?.receita_projetada?.toLocaleString("pt-BR") || 0}</p>
        </div>
        <div className="card metric-card">
          <h3>🔥 Leads Quentes</h3>
          <p className="metric-value">{forecast?.leads_quentes || 0}</p>
          <span className="metric-change positive">{forecast?.probabilidade_media || 0}% prob. média</span>
        </div>
        <div className="card metric-card">
          <h3>👥 Vendedores</h3>
          <p className="metric-value">{salespeople.length}</p>
        </div>
        <div className="card metric-card">
          <h3>📊 Taxa Conversão</h3>
          <p className="metric-value">
            {salespeople.length > 0
              ? Math.round(salespeople.reduce((s, v) => s + v.conversao, 0) / salespeople.length)
              : 0}%
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div className="card">
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Funil de Vendas</h2>
          <canvas ref={funnelRef} />
          <div style={{ marginTop: 16 }}>
            {pipeline.map((p) => (
              <div key={p.etapa} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid var(--borda)" }}>
                <span>{ETAPA_LABEL[p.etapa] || p.etapa}</span>
                <span><strong>{p.quantidade}</strong> leads · R$ {p.valor.toLocaleString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Ranking de Vendedores</h2>
          <table className="reports-table">
            <thead>
              <tr><th>Vendedor</th><th>Leads</th><th>Clientes</th><th>Conv.</th><th>Receita</th><th>Ticket</th></tr>
            </thead>
            <tbody>
              {salespeople.sort((a, b) => b.receita - a.receita).map((v) => (
                <tr key={v.vendedor_uid}>
                  <td><strong>{v.nome}</strong></td>
                  <td>{v.leads}</td>
                  <td>{v.clientes}</td>
                  <td><span style={{ color: v.conversao > 40 ? "var(--green-imperador)" : "var(--vermelho-dental)" }}>{v.conversao}%</span></td>
                  <td>R$ {v.receita.toLocaleString("pt-BR")}</td>
                  <td>R$ {v.ticket_medio.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
              {salespeople.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--cinza-medio)" }}>Nenhum vendedor com leads atribuídos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
