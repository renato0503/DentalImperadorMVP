/* ============================================================
   DENTAL IMPERADOR — CRM Kanban (mock)
   Pipeline de leads/clientes com drag-and-drop entre colunas.
   ============================================================ */
const CRM = (function () {
  const COLS = [
    { id: "prospect", title: "Prospects", color: "#6B7280" },
    { id: "lead",     title: "Leads",     color: "#D97706" },
    { id: "active",   title: "Clientes Ativos", color: "#007A3D" },
    { id: "won",      title: "Ganhos",    color: "#00A650" },
    { id: "churn",    title: "Em Risco",  color: "#E31E24" },
  ];

  let DEALS = [
    { id: "d1", name: "Clínica Sorriso SP", val: 2480, tag: "Clareamento", col: "active", meta: "12 interações" },
    { id: "d2", name: "OdontoMax Ltda", val: 8120, tag: "Implantes", col: "won", meta: "Cliente desde 2024" },
    { id: "d3", name: "Rede Dental Vita", val: 15300, tag: "Equipamentos", col: "lead", meta: "CNPJ validado" },
    { id: "d4", name: "Dra. Helena Castro", val: 640, tag: "Protético", col: "won", meta: "NPS 9" },
    { id: "d5", name: "BioDent Clínica", val: 3210, tag: "Restauradores", col: "active", meta: "2 pedidos/mês" },
    { id: "d6", name: "Nova Sorriso RJ", val: 540, tag: "Protético", col: "prospect", meta: "Indicação" },
    { id: "d7", name: "Centro Dental BH", val: 4200, tag: "Implantes", col: "lead", meta: "Proposta enviada" },
    { id: "d8", name: "Dra. Paula Lima", val: 980, tag: "Clareamento", col: "churn", meta: "Sem compra há 60d" },
    { id: "d9", name: "OdontoCare GO", val: 6700, tag: "Equipamentos", col: "prospect", meta: "Site institucional" },
  ];

  const BRL = (v) => "R$ " + v.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let dragId = null;

  function init(root) {
    const pipelineTotal = DEALS.reduce((s, d) => s + d.val, 0);

    root.innerHTML = `
      <div class="page-head flex items-center justify-between flex-wrap gap-16">
        <div>
          <h1>CRM / Kanban</h1>
          <p>Pipeline de prospects, leads e clientes (arraste os cards entre as colunas).</p>
        </div>
        <div class="card" style="padding:14px 20px;box-shadow:none;">
          <div class="muted" style="font-size:13px;">Pipeline total</div>
          <div class="pipeline-total text-green" style="font-size:22px;">${BRL(pipelineTotal)}</div>
        </div>
      </div>

      <div class="kanban" id="kanban"></div>`;

    const board = root.querySelector("#kanban");
    board.innerHTML = COLS.map((c) => {
      const items = DEALS.filter((d) => d.col === c.id);
      const sum = items.reduce((s, d) => s + d.val, 0);
      return `<div class="kanban-col" data-col="${c.id}">
        <div class="kcol-head">
          <h4><span class="dot" style="background:${c.color}"></span>${c.title}</h4>
          <span class="count">${items.length} · ${BRL(sum)}</span>
        </div>
        <div class="kcol-body" data-drop="${c.id}">
          ${items.map(dealCard).join("")}
        </div>
      </div>`;
    }).join("");

    // Drag & drop
    board.querySelectorAll(".deal").forEach((el) => {
      el.setAttribute("draggable", "true");
      el.addEventListener("dragstart", (e) => { dragId = el.dataset.id; e.dataTransfer.effectAllowed = "move"; });
    });
    board.querySelectorAll(".kcol-body").forEach((zone) => {
      zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.closest(".kanban-col").classList.add("drag-over"); });
      zone.addEventListener("dragleave", () => zone.closest(".kanban-col").classList.remove("drag-over"));
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.closest(".kanban-col").classList.remove("drag-over");
        const d = DEALS.find((x) => x.id === dragId);
        if (d) { d.col = zone.dataset.drop; render(root); }
      });
    });
  }

  function dealCard(d) {
    return `<div class="deal" data-id="${d.id}" draggable="true">
      <div class="d-top">
        <span class="d-name">${esc(d.name)}</span>
        <span class="d-val">${BRL(d.val)}</span>
      </div>
      <div class="d-meta">
        <span class="tag">${esc(d.tag)}</span>
        <span>${esc(d.meta)}</span>
      </div>
    </div>`;
  }

  function render(root) {
    // reaproveita init sem recriar listeners antigos: re-render simples
    const board = root.querySelector("#kanban");
    const pipelineTotal = DEALS.reduce((s, d) => s + d.val, 0);
    root.querySelector(".pipeline-total").textContent = BRL(pipelineTotal);

    board.innerHTML = COLS.map((c) => {
      const items = DEALS.filter((d) => d.col === c.id);
      const sum = items.reduce((s, d) => s + d.val, 0);
      return `<div class="kanban-col" data-col="${c.id}">
        <div class="kcol-head">
          <h4><span class="dot" style="background:${c.color}"></span>${c.title}</h4>
          <span class="count">${items.length} · ${BRL(sum)}</span>
        </div>
        <div class="kcol-body" data-drop="${c.id}">
          ${items.map(dealCard).join("")}
        </div>
      </div>`;
    }).join("");

    board.querySelectorAll(".deal").forEach((el) => {
      el.setAttribute("draggable", "true");
      el.addEventListener("dragstart", (e) => { dragId = el.dataset.id; e.dataTransfer.effectAllowed = "move"; });
    });
    board.querySelectorAll(".kcol-body").forEach((zone) => {
      zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.closest(".kanban-col").classList.add("drag-over"); });
      zone.addEventListener("dragleave", () => zone.closest(".kanban-col").classList.remove("drag-over"));
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.closest(".kanban-col").classList.remove("drag-over");
        const d = DEALS.find((x) => x.id === dragId);
        if (d) { d.col = zone.dataset.drop; render(root); }
      });
    });
  }

  return { init };
})();
