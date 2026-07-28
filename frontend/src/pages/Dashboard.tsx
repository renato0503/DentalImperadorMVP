import { useEffect, useRef, useState } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController
);

interface Metrics {
  faturamento_mes: number;
  variacao_faturamento: number;
  total_pedidos_mes: number;
  variacao_pedidos: number;
  leads_novos_mes: number;
  ticket_medio: number;
}

interface SalesMonth {
  mes: string;
  total: number;
}

interface SegmentItem {
  segmento: string;
  quantidade: number;
}

const SEGMENT_COLORS = ["#00A650", "#007A3D", "#E31E24", "#FFD700", "#6B7280"];

export function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [salesHistory, setSalesHistory] = useState<SalesMonth[]>([]);
  const [segments, setSegments] = useState<SegmentItem[]>([]);
  const barRef = useRef<HTMLCanvasElement>(null);
  const doughnutRef = useRef<HTMLCanvasElement>(null);
  const barChart = useRef<Chart | null>(null);
  const doughnutChart = useRef<Chart | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/admin/metrics").then((r) => r.json()),
      fetch("/api/v1/admin/sales-history").then((r) => r.json()),
      fetch("/api/v1/admin/segment-stats").then((r) => r.json()),
    ]).then(([m, s, seg]) => {
      setMetrics(m);
      setSalesHistory(Array.isArray(s) ? s : []);
      setSegments(Array.isArray(seg) ? seg : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!barRef.current || salesHistory.length === 0) return;
    if (barChart.current) barChart.current.destroy();
    barChart.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: salesHistory.map((s) => s.mes),
        datasets: [{
          label: "Vendas (R$)",
          data: salesHistory.map((s) => s.total),
          backgroundColor: "#00A650",
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (v) => "R$ " + Number(v).toLocaleString("pt-BR") },
          },
        },
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
          backgroundColor: segments.map((_, i) => SEGMENT_COLORS[i % SEGMENT_COLORS.length]),
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
      },
    });
  }, [segments]);

  useEffect(() => {
    return () => {
      if (barChart.current) barChart.current.destroy();
      if (doughnutChart.current) doughnutChart.current.destroy();
    };
  }, []);

  const fmt = (n: number) => `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

  return (
    <div className="page page-dashboard">
      <h1>Dashboard</h1>
      <p className="page-subtitle">
        Métricas e indicadores de performance da Dental Imperador.
      </p>

      <div className="dashboard-grid">
        <div className="card metric-card">
          <h3>Faturamento do Mês</h3>
          <p className="metric-value">{fmt(metrics?.faturamento_mes || 0)}</p>
          <span className={`metric-change ${(metrics?.variacao_faturamento ?? 0) >= 0 ? "positive" : "negative"}`}>
            {(metrics?.variacao_faturamento ?? 0) >= 0 ? "+" : ""}{metrics?.variacao_faturamento ?? 0}% vs mês anterior
          </span>
        </div>
        <div className="card metric-card">
          <h3>Pedidos</h3>
          <p className="metric-value">{metrics?.total_pedidos_mes || 0}</p>
          <span className={`metric-change ${(metrics?.variacao_pedidos ?? 0) >= 0 ? "positive" : "negative"}`}>
            {(metrics?.variacao_pedidos ?? 0) >= 0 ? "+" : ""}{metrics?.variacao_pedidos ?? 0}% vs mês anterior
          </span>
        </div>
        <div className="card metric-card">
          <h3>Leads Novos</h3>
          <p className="metric-value">{metrics?.leads_novos_mes || 0}</p>
        </div>
        <div className="card metric-card">
          <h3>Ticket Médio</h3>
          <p className="metric-value">{fmt(metrics?.ticket_medio || 0)}</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="card chart-card">
          <h3>Vendas por Mês</h3>
          <canvas ref={barRef} />
        </div>
        <div className="card chart-card">
          <h3>Segmento de Clientes</h3>
          <canvas ref={doughnutRef} />
        </div>
      </div>
    </div>
  );
}
