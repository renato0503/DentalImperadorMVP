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
  BarController, BarElement, CategoryScale, LinearScale,
  Tooltip, Legend, ArcElement, DoughnutController
);

interface ChurnSummary {
  total_clientes: number;
  risco_alto: number;
  risco_medio: number;
  risco_baixo: number;
  taxa_churn: number;
  ticket_medio_geral: number;
}

interface ChurnRisk {
  cliente_id: string;
  cliente_nome: string;
  email: string;
  dias_inativo: number;
  score: string;
  segmento: string;
}

export function ChurnDashboard() {
  const [summary, setSummary] = useState<ChurnSummary | null>(null);
  const [risks, setRisks] = useState<ChurnRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const barRef = useRef<HTMLCanvasElement>(null);
  const doughnutRef = useRef<HTMLCanvasElement>(null);
  const barChart = useRef<Chart | null>(null);
  const doughnutChart = useRef<Chart | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/churn/summary").then((r) => r.json()),
      fetch("/api/v1/churn/risks").then((r) => r.json()),
    ]).then(([s, r]) => {
      setSummary(s);
      setRisks(Array.isArray(r) ? r : []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!summary) return;

    if (barChart.current) barChart.current.destroy();
    if (doughnutChart.current) doughnutChart.current.destroy();

    const barCanvas = barRef.current;
    const doughnutCanvas = doughnutRef.current;
    if (!barCanvas || !doughnutCanvas) return;

    barChart.current = new Chart(barCanvas, {
      type: "bar",
      data: {
        labels: ["Baixo Risco", "Médio Risco", "Alto Risco"],
        datasets: [{
          label: "Clientes",
          data: [summary.risco_baixo, summary.risco_medio, summary.risco_alto],
          backgroundColor: ["#00A650", "#FFD700", "#E31E24"],
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    });

    doughnutChart.current = new Chart(doughnutCanvas, {
      type: "doughnut",
      data: {
        labels: ["Bx (0-30d)", "Médio (31-60d)", "Alto (60d+)"],
        datasets: [{
          data: [summary.risco_baixo, summary.risco_medio, summary.risco_alto],
          backgroundColor: ["#00A650", "#FFD700", "#E31E24"],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
      },
    });

    return () => {
      if (barChart.current) barChart.current.destroy();
      if (doughnutChart.current) doughnutChart.current.destroy();
    };
  }, [summary]);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="page-churn">
      <div className="churn-metrics">
        <div className="card metric-card">
          <h3>Taxa de Churn</h3>
          <p className="metric-value">{summary?.taxa_churn || 0}%</p>
          <span className="metric-change negative">Clientes em risco alto</span>
        </div>
        <div className="card metric-card">
          <h3>Total de Clientes</h3>
          <p className="metric-value">{summary?.total_clientes || 0}</p>
        </div>
        <div className="card metric-card">
          <h3>Risco Alto</h3>
          <p className="metric-value" style={{ color: "var(--vermelho-dental)" }}>
            {summary?.risco_alto || 0}
          </p>
        </div>
        <div className="card metric-card">
          <h3>Ticket Médio</h3>
          <p className="metric-value">
            R$ {summary?.ticket_medio_geral?.toLocaleString("pt-BR") || 0}
          </p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="card chart-card">
          <h3>Distribuição de Risco</h3>
          <canvas ref={barRef} />
        </div>
        <div className="card chart-card">
          <h3>Proporção por Score</h3>
          <canvas ref={doughnutRef} />
        </div>
      </div>

      <div className="card">
        <h3>Clientes em Risco</h3>
        <div className="churn-table-wrap">
          <table className="churn-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Segmento</th>
                <th>Dias Inativo</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {risks
                .filter((r) => r.score === "alto" || r.score === "medio")
                .map((r) => (
                  <tr key={r.cliente_id}>
                    <td>{r.cliente_nome}</td>
                    <td>{r.segmento}</td>
                    <td>{r.dias_inativo}d</td>
                    <td>
                      <span className={`churn-badge churn-${r.score}`}>
                        {r.score === "alto" ? "🔴 Alto" : "🟡 Médio"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
