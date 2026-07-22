import { useEffect, useRef } from "react";
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

export function DashboardPage() {
  const barRef = useRef<HTMLCanvasElement>(null);
  const doughnutRef = useRef<HTMLCanvasElement>(null);
  const barChart = useRef<Chart | null>(null);
  const doughnutChart = useRef<Chart | null>(null);

  useEffect(() => {
    if (barRef.current) {
      if (barChart.current) barChart.current.destroy();
      barChart.current = new Chart(barRef.current, {
        type: "bar",
        data: {
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
          datasets: [
            {
              label: "Vendas (R$)",
              data: [12000, 18000, 15000, 22000, 28000, 25000, 32000],
              backgroundColor: "#00A650",
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (v) =>
                  "R$ " + Number(v).toLocaleString("pt-BR"),
              },
            },
          },
        },
      });
    }

    if (doughnutRef.current) {
      if (doughnutChart.current) doughnutChart.current.destroy();
      doughnutChart.current = new Chart(doughnutRef.current, {
        type: "doughnut",
        data: {
          labels: ["Consultório", "Clínica", "Distribuidor", "Instituição"],
          datasets: [
            {
              data: [45, 30, 15, 10],
              backgroundColor: ["#00A650", "#007A3D", "#E31E24", "#FFD700"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
    }

    return () => {
      if (barChart.current) barChart.current.destroy();
      if (doughnutChart.current) doughnutChart.current.destroy();
    };
  }, []);

  return (
    <div className="page page-dashboard">
      <h1>Dashboard</h1>
      <p className="page-subtitle">
        Métricas e indicadores de performance da Dental Imperador.
      </p>

      <div className="dashboard-grid">
        <div className="card metric-card">
          <h3>Faturamento do Mês</h3>
          <p className="metric-value">R$ 32.000</p>
          <span className="metric-change positive">+14% vs mês anterior</span>
        </div>
        <div className="card metric-card">
          <h3>Pedidos</h3>
          <p className="metric-value">47</p>
          <span className="metric-change positive">+8% vs mês anterior</span>
        </div>
        <div className="card metric-card">
          <h3>Leads Novos</h3>
          <p className="metric-value">23</p>
          <span className="metric-change positive">+12% vs mês anterior</span>
        </div>
        <div className="card metric-card">
          <h3>Ticket Médio</h3>
          <p className="metric-value">R$ 1.240</p>
          <span className="metric-change negative">-3% vs mês anterior</span>
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
