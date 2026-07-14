/* ============================================================
   DENTAL IMPERADOR — Orçamento Automático (mock)
   Consulta de catálogo + geração de proposta.
   ============================================================ */
const Orcamento = (function () {
  const CATALOG = [
    { sku: "RES-500",  name: "Resina Composta 500g",         cat: "Restauradores", price: 1290.0, stock: 142 },
    { sku: "BIC-100",  name: "Bicuspídeo Estético (cx 100)", cat: "Protéticos",    price: 540.0,  stock: 38 },
    { sku: "GEL-1L",   name: "Gel Clareador Profissional 1L", cat: "Clareamento",   price: 89.9,   stock: 210 },
    { sku: "PROT-SET", name: "Protetor Oclusal Kit",         cat: "Protéticos",    price: 320.0,  stock: 0 },
    { sku: "ANEST-50", name: "Anestésico Articaína (cx 50)", cat: "Insumos",       price: 210.0,  stock: 96 },
    { sku: "IMPL-TIT", name: "Implante Titânio Ø3.75 (un)",  cat: "Implantes",     price: 480.0,  stock: 64 },
    { sku: "CIM-200",  name: "Cimento Provisório 200g",      cat: "Insumos",       price: 75.0,   stock: 12 },
    { sku: "LUV-LED",  name: "Lâmpada LED Fotopolimeriz. ",  cat: "Equipamentos",  price: 1190.0, stock: 21 },
  ];

  const BRL = (v) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function init(root) {
    root.innerHTML = `
      <div class="page-head">
        <h1>Orçamento Automático</h1>
        <p>Selecione produtos do catálogo e gere uma proposta instantânea (dados simulados).</p>
      </div>

      <div class="grid grid-2" style="align-items:start;">
        <!-- Catálogo -->
        <div class="card">
          <div class="card-head">
            <h3>Catálogo</h3>
            <div class="search" style="width:220px;">
              <i data-lucide="search"></i>
              <input id="catSearch" type="text" placeholder="Buscar produto..." />
            </div>
          </div>
          <div id="catalog" style="display:flex;flex-direction:column;gap:10px;max-height:560px;overflow:auto;"></div>
        </div>

        <!-- Proposta -->
        <div class="card">
          <div class="card-head">
            <h3>Proposta</h3>
            <span class="badge-status status-faturado">Rascunho</span>
          </div>
          <div id="proposal" style="display:flex;flex-direction:column;gap:8px;min-height:120px;">
            <p class="muted">Nenhum item selecionado ainda.</p>
          </div>
          <hr class="dental-line" />
          <div style="display:flex;justify-content:space-between;font-family:var(--font-head);font-weight:700;font-size:20px;">
            <span>Total</span><span id="propTotal" class="text-green">R$ 0,00</span>
          </div>
          <div class="mt-16 flex gap-12">
            <button class="btn btn-primary btn-block" id="sendProp"><i data-lucide="send" style="width:18px;height:18px;"></i> Enviar proposta</button>
            <button class="btn btn-ghost" id="clearProp"><i data-lucide="trash-2" style="width:18px;height:18px;"></i></button>
          </div>
        </div>
      </div>`;
    if (window.lucide) lucide.createIcons();

    const cart = {}; // sku -> qty
    const catalogEl = root.querySelector("#catalog");
    const proposalEl = root.querySelector("#proposal");
    const totalEl = root.querySelector("#propTotal");
    const searchEl = root.querySelector("#catSearch");

    function renderCatalog(filter) {
      const f = (filter || "").toLowerCase();
      const list = CATALOG.filter((p) => p.name.toLowerCase().includes(f) || p.cat.toLowerCase().includes(f));
      catalogEl.innerHTML = list.map((p) => {
        const out = p.stock === 0;
        return `<div class="deal" style="cursor:default;">
          <div class="d-top">
            <div>
              <div class="d-name">${esc(p.name)}</div>
              <div class="d-meta">SKU ${p.sku} · ${p.cat}</div>
            </div>
            <div class="d-val">${BRL(p.price)}</div>
          </div>
          <div class="d-meta" style="margin-top:8px;">
            ${out ? '<span class="badge-status status-cancelado">Sem estoque</span>' : '<span class="badge-status status-entregue">Em estoque: ' + p.stock + '</span>'}
            <span class="ml-auto" style="display:flex;align-items:center;gap:8px;">
              <button class="btn btn-sm btn-outline" data-act="dec" data-sku="${p.sku}" ${out ? "disabled" : ""}>−</button>
              <span id="qty-${p.sku}" style="min-width:24px;text-align:center;font-weight:600;">${cart[p.sku] || 0}</span>
              <button class="btn btn-sm btn-primary" data-act="inc" data-sku="${p.sku}" ${out ? "disabled" : ""}>+</button>
            </span>
          </div>
        </div>`;
      }).join("");
      if (window.lucide) lucide.createIcons();
    }

    function renderProposal() {
      const keys = Object.keys(cart).filter((k) => cart[k] > 0);
      if (!keys.length) {
        proposalEl.innerHTML = `<p class="muted">Nenhum item selecionado ainda.</p>`;
        totalEl.textContent = "R$ 0,00";
        if (window.lucide) lucide.createIcons();
        return;
      }
      let total = 0;
      proposalEl.innerHTML = keys.map((k) => {
        const p = CATALOG.find((x) => x.sku === k);
        const sub = p.price * cart[k];
        total += sub;
        return `<div class="q-item" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed var(--borda);">
          <span>${esc(p.name)} <span class="muted">× ${cart[k]}</span></span>
          <span><strong>${BRL(sub)}</strong></span>
        </div>`;
      }).join("");
      totalEl.textContent = BRL(total);
    }

    catalogEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-act]");
      if (!btn) return;
      const sku = btn.dataset.sku;
      if (!cart[sku]) cart[sku] = 0;
      cart[sku] += btn.dataset.act === "inc" ? 1 : -1;
      if (cart[sku] < 0) cart[sku] = 0;
      const q = document.getElementById("qty-" + sku);
      if (q) q.textContent = cart[sku];
      renderProposal();
    });

    searchEl.addEventListener("input", () => renderCatalog(searchEl.value));

    root.querySelector("#clearProp").addEventListener("click", () => {
      Object.keys(cart).forEach((k) => (cart[k] = 0));
      renderCatalog(searchEl.value);
      renderProposal();
    });

    root.querySelector("#sendProp").addEventListener("click", () => {
      const keys = Object.keys(cart).filter((k) => cart[k] > 0);
      if (!keys.length) { alert("Adicione ao menos um item à proposta."); return; }
      const proto = "#ORÇ-" + (1000 + Math.floor(Math.random() * 9000));
      const total = keys.reduce((s, k) => s + CATALOG.find((x) => x.sku === k).price * cart[k], 0);
      alert("Proposta " + proto + " enviada!\nTotal: " + BRL(total) + "\n(Registro simulado — seria salvo no CRM.)");
    });

    renderCatalog("");
    renderProposal();
  }

  return { init };
})();
