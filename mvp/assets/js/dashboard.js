/* ============================================================
   DENTAL IMPERADOR — Dashboard (mock)
   Métricas + gráficos Chart.js com dados simulados.
   ============================================================ */
const Dashboard = (function () {
  function card(icon, label, value, delta, up) {
    return `<div class="metric">
      <div class="m-top">
        <div class="m-icon"><i data-lucide="${icon}"></i></div>
        <span class="m-delta ${up ? "up" : "down"}">${up ? "▲" : "▼"} ${delta}</span>
      </div>
      <div class="m-label">${label}</div>
      <div class="m-value">${value}</div>
    </div>`;
  }

  function init(root) {
    root.innerHTML = `
      <div class="page-head">
        <h1>Dashboard</h1>
        <p>Visão geral de aquisição, conversão, NPS e operação — dados simulados.</p>
      </div>

      <div class="grid grid-4">
        ${card("users", "Novos clientes (mês)", "328", "12,4%", true)}
        ${card("percent", "Taxa de conversão", "24,8%", "3,1%", true)}
        ${card("smile", "NPS", "71", "5 pts", true)}
        ${card("shopping-cart", "Ticket médio", "R$ 1.940", "2,2%", false)}
      </div>

      <div class="grid grid-2 mt-24" style="align-items:start;">
        <div class="card">
          <div class="card-head"><h3>Pedidos por status</h3><span class="muted" style="font-size:13px;">Jul/2026</span></div>
          <canvas id="chartStatus" height="220"></canvas>
        </div>
        <div class="card">
          <div class="card-head"><h3>Receita mensal (R$ mil)</h3><span class="muted" style="font-size:13px;">últimos 6 meses</span></div>
          <canvas id="chartRevenue" height="220"></canvas>
        </div>
      </div>

      <div class="grid grid-2 mt-24" style="align-items:start;">
        <div class="card">
          <div class="card-head"><h3>Origem de aquisição</h3></div>
          <canvas id="chartSource" height="220"></canvas>
        </div>
        <div class="card">
          <div class="card-head"><h3>Últimos pedidos</h3><a class="btn btn-sm btn-outline" href="pedido.html">Consultar</a></div>
          <div class="table-wrap">
            <table class="data">
              <thead><tr><th>Pedido</th><th>Cliente</th><th>Valor</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td class="cell-strong">#10520</td><td>Rede Dental Vita</td><td>R$ 15.300</td><td><span class="badge-status status-faturado">Faturado</span></td></tr>
                <tr><td class="cell-strong">#10501</td><td>OdontoMax Ltda</td><td>R$ 8.120</td><td><span class="badge-status status-enviado">Enviado</span></td></tr>
                <tr><td class="cell-strong">#10482</td><td>Clínica Sorriso SP</td><td>R$ 2.480</td><td><span class="badge-status status-separado">Separado</span></td></tr>
                <tr><td class="cell-strong">#10390</td><td>Dra. Helena Castro</td><td>R$ 640</td><td><span class="badge-status status-entregue">Entregue</span></td></tr>
                <tr><td class="cell-strong">#10355</td><td>BioDent Clínica</td><td>R$ 3.210</td><td><span class="badge-status status-entregue">Entregue</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
    if (window.lucide) lucide.createIcons();

    const green = "#00A650", dark = "#007A3D", red = "#E31E24", gray = "#6B7280";
    const grid = "#E5E7EB";

    if (window.Chart) {
      new Chart(document.getElementById("chartStatus"), {
        type: "doughnut",
        data: {
          labels: ["Faturado", "Separado", "Enviado", "Entregue"],
          datasets: [{ data: [42, 28, 19, 96], backgroundColor: [dark, "#1D4ED8", "#0F766E", green], borderWidth: 2, borderColor: "#fff" }],
        },
        options: { plugins: { legend: { position: "bottom" } }, cutout: "62%" },
      });

      new Chart(document.getElementById("chartRevenue"), {
        type: "line",
        data: {
          labels: ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
          datasets: [{ label: "Receita", data: [82, 91, 88, 104, 118, 132], borderColor: green, backgroundColor: "rgba(0,166,80,.12)", fill: true, tension: 0.35, borderWidth: 3, pointBackgroundColor: green }],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: grid } }, y: { grid: { color: grid }, beginAtZero: true },
          },
        },
      });

      new Chart(document.getElementById("chartSource"), {
        type: "bar",
        data: {
          labels: ["Indicação", "Google", "Instagram", "LinkedIn", "Outros"],
          datasets: [{ label: "Leads", data: [120, 95, 78, 41, 22], backgroundColor: [green, dark, red, "#D97706", gray], borderRadius: 6 }],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { x: { grid: { display: false } }, y: { grid: { color: grid }, beginAtZero: true } },
        },
      });
    } else {
      console.warn("Chart.js não carregou (offline?).");
    }
  }

  return { init };
})();
