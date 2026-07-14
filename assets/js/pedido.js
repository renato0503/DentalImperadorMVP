/* ============================================================
   DENTAL IMPERADOR — Status de Pedido (mock)
   Consulta por número e exibe linha do tempo + itens.
   ============================================================ */
const Pedido = (function () {
  const STATUS_LABEL = {
    Faturado: "Faturado", Separado: "Separado", Enviado: "Enviado", Entregue: "Entregue", Cancelado: "Cancelado",
  };

  const ORDERS = {
    "10482": {
      client: "Clínica Sorriso SP", total: "R$ 2.480,00", date: "10/07/2026", status: "Separado",
      items: [
        { sku: "RES-500", name: "Resina Composta 500g", qty: 1 },
        { sku: "ANEST-50", name: "Anestésico Articaína (cx 50)", qty: 3 },
        { sku: "GEL-1L", name: "Gel Clareador Profissional 1L", qty: 2 },
      ],
    },
    "10501": {
      client: "OdontoMax Ltda", total: "R$ 8.120,00", date: "08/07/2026", status: "Enviado",
      items: [
        { sku: "IMPL-TIT", name: "Implante Titânio Ø3.75 (un)", qty: 10 },
        { sku: "BIC-100", name: "Bicuspídeo Estético (cx 100)", qty: 4 },
      ],
    },
    "10390": {
      client: "Dra. Helena Castro", total: "R$ 640,00", date: "02/07/2026", status: "Entregue",
      items: [{ sku: "PROT-SET", name: "Protetor Oclusal Kit", qty: 2 }],
    },
    "10520": {
      client: "Rede Dental Vita", total: "R$ 15.300,00", date: "11/07/2026", status: "Faturado",
      items: [
        { sku: "LUV-LED", name: "Lâmpada LED Fotopolimeriz.", qty: 6 },
        { sku: "CIM-200", name: "Cimento Provisório 200g", qty: 20 },
      ],
    },
  };

  function stepsFor(current) {
    const all = ["Faturado", "Separado", "Enviado", "Entregue"];
    if (current === "Cancelado") return [{ key: "Cancelado", label: "Cancelado", desc: "Pedido cancelado.", state: "current" }];
    const idx = all.indexOf(current);
    return all.map((k, i) => ({
      key: k, label: k,
      desc: {
        Faturado: "Pagamento confirmado e nota fiscal emitida.",
        Separado: "Itens separados no almoxarifado.",
        Enviado: "Saiu para entrega com a transportadora.",
        Entregue: "Pedido entregue e assinado pelo cliente.",
      }[k],
      state: i < idx ? "done" : i === idx ? "current" : "todo",
    }));
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function init(root) {
    root.innerHTML = `
      <div class="page-head">
        <h1>Status de Pedido</h1>
        <p>Consulte a linha do tempo de entrega de qualquer pedido (dados simulados).</p>
      </div>

      <div class="card" style="max-width:620px;">
        <div class="field">
          <label for="orderId">Número do pedido</label>
          <div class="flex gap-12">
            <input class="input" id="orderId" type="text" placeholder="Ex.: 10482" />
            <button class="btn btn-primary" id="searchBtn"><i data-lucide="search" style="width:18px;height:18px;"></i> Consultar</button>
          </div>
          <div class="mt-8 flex gap-8">
            ${Object.keys(ORDERS).map((id) => `<button class="btn btn-sm btn-outline quick-sample" data-id="${id}">#${id}</button>`).join("")}
          </div>
        </div>
      </div>

      <div class="pedido-result card mt-24" id="result" style="max-width:820px;"></div>`;
    if (window.lucide) lucide.createIcons();

    const result = root.querySelector("#result");
    const input = root.querySelector("#orderId");

    function lookup(raw) {
      const id = String(raw).replace(/[^0-9]/g, "");
      const ord = ORDERS[id];
      if (!ord) {
        result.classList.add("show");
        result.innerHTML = `<div class="badge-status status-cancelado">Pedido não encontrado</div>
          <p class="mt-16 muted">Nenhum pedido com o número <strong>#${esc(id)}</strong>. Tente as sugestões acima (ex.: 10482).</p>`;
        if (window.lucide) lucide.createIcons();
        return;
      }
      const steps = stepsFor(ord.status);
      const stepHtml = steps.map((s) => `
        <div class="track-step ${s.state === "done" ? "done" : s.state === "current" ? "current" : ""}">
          <div class="track-dot">${s.state === "todo" ? "" : s.state === "done" ? "✓" : "•"}</div>
          <div class="track-body"><h4>${s.label}</h4><p>${s.desc}</p></div>
        </div>`).join("");

      const itemsHtml = ord.items.map((it) => `
        <tr>
          <td class="cell-strong">${esc(it.sku)}</td>
          <td>${esc(it.name)}</td>
          <td>${it.qty}</td>
        </tr>`).join("");

      const badgeClass = {
        Entregue: "status-entregue", Separado: "status-separado", Enviado: "status-enviado",
        Faturado: "status-faturado", Cancelado: "status-cancelado",
      }[ord.status];

      result.innerHTML = `
        <div class="flex items-center justify-between flex-wrap gap-16">
          <div>
            <h3>Pedido #${esc(id)}</h3>
            <p class="muted">${esc(ord.client)} · Emitido em ${ord.date}</p>
          </div>
          <span class="badge-status ${badgeClass}">${STATUS_LABEL[ord.status]}</span>
        </div>
        <hr class="dental-line" />
        <div class="grid grid-2" style="align-items:start;">
          <div>
            <h4 style="font-size:14px;margin-bottom:12px;">Linha do tempo</h4>
            <div class="track">${stepHtml}</div>
          </div>
          <div>
            <h4 style="font-size:14px;margin-bottom:12px;">Itens</h4>
            <div class="table-wrap">
              <table class="data">
                <thead><tr><th>SKU</th><th>Produto</th><th>Qtd</th></tr></thead>
                <tbody>${itemsHtml}</tbody>
              </table>
            </div>
            <div class="mt-16" style="display:flex;justify-content:space-between;font-family:var(--font-head);font-weight:700;font-size:18px;">
              <span>Total</span><span class="text-green">${ord.total}</span>
            </div>
          </div>
        </div>`;
      result.classList.add("show");
      if (window.lucide) lucide.createIcons();
    }

    root.querySelector("#searchBtn").addEventListener("click", () => lookup(input.value));
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") lookup(input.value); });
    root.querySelectorAll(".quick-sample").forEach((b) =>
      b.addEventListener("click", () => { input.value = b.dataset.id; lookup(b.dataset.id); })
    );
  }

  return { init };
})();
