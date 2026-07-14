/* ============================================================
   DENTAL IMPERADOR — Chatbot (mock interativo)
   Fluxos: saudação -> triagem (nome, doc, tipo) ->
   orçamento automático OU status de pedido.
   ============================================================ */
const ChatBot = (function () {
  const MOCK_PRODUCTS = [
    { sku: "RES-500",   name: "Resina Composta 500g",            price: 1290.0 },
    { sku: "BIC-100",   name: "Bicuspídeo Estético (cx 100)",   price: 540.0 },
    { sku: "GEL-1L",    name: "Gel Clareador Profissional 1L",   price: 89.9 },
    { sku: "PROT-SET",  name: "Protetor Oclusal Kit",            price: 320.0 },
    { sku: "ANEST-50",  name: "Anestésico Articaína (cx 50)",   price: 210.0 },
    { sku: "IMPL-TIT",  name: "Implante Titânio Ø3.75 (un)",     price: 480.0 },
  ];

  const MOCK_ORDERS = {
    "10482": { status: "Separado",  client: "Clínica Sorriso SP",   total: "R$ 2.480,00", steps: orderSteps("Separado") },
    "10501": { status: "Enviado",   client: "OdontoMax Ltda",       total: "R$ 8.120,00", steps: orderSteps("Enviado") },
    "10390": { status: "Entregue",  client: "Dra. Helena Castro",   total: "R$ 640,00",   steps: orderSteps("Entregue") },
    "10520": { status: "Faturado",  client: "Rede Dental Vita",     total: "R$ 15.300,00", steps: orderSteps("Faturado") },
  };

  function orderSteps(current) {
    const all = [
      { key: "Faturado", label: "Faturado",  desc: "Pagamento confirmado e nota fiscal emitida." },
      { key: "Separado", label: "Separado",  desc: "Itens separados no almoxarifado." },
      { key: "Enviado",  label: "Enviado",   desc: "Saiu para entrega com a transportadora." },
      { key: "Entregue", label: "Entregue",  desc: "Pedido entregue e assinado pelo cliente." },
    ];
    const idx = all.findIndex((s) => s.key === current);
    return all.map((s, i) => ({
      ...s,
      state: i < idx ? "done" : (i === idx ? "current" : "todo"),
    }));
  }

  const BRL = (v) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function init(root) {
    root.innerHTML = `
      <div class="chat-layout">
        <div class="page-head">
          <h1>Assistente Virtual</h1>
          <p>Triagem, orçamento automático e status de pedido — tudo em uma conversa.</p>
        </div>
        <div class="chat-card">
          <div class="chat-head">
            <div class="bot-avatar"><i data-lucide="bot"></i></div>
            <div>
              <div style="font-weight:600;"><span class="status-dot"></span>Assistente Dental Imperador</div>
              <div style="font-size:12px;color:var(--cinza-medio);">Online · resposta instantânea</div>
            </div>
          </div>
          <div class="chat-window" id="chatWindow"></div>
          <div class="quick-replies" id="quickReplies"></div>
          <form class="chat-form" id="chatForm">
            <input type="text" id="chatInput" placeholder="Digite sua mensagem..." autocomplete="off" />
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>`;
    if (window.lucide) lucide.createIcons();

    const win = root.querySelector("#chatWindow");
    const quick = root.querySelector("#quickReplies");
    const form = root.querySelector("#chatForm");
    const input = root.querySelector("#chatInput");

    const ctx = { name: null, doc: null, step: "start" };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    function botSay(html, withQuote) {
      const el = document.createElement("div");
      el.className = "msg bot";
      el.innerHTML = `<div class="who">Assistente</div>${html}${withQuote || ""}`;
      win.appendChild(el);
      win.scrollTop = win.scrollHeight;
    }
    function userSay(text) {
      const el = document.createElement("div");
      el.className = "msg user";
      el.innerHTML = `<div class="who">Você</div>${esc(text)}`;
      win.appendChild(el);
      win.scrollTop = win.scrollHeight;
    }
    function setQuick(items) {
      quick.innerHTML = "";
      items.forEach((it) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "quick";
        b.textContent = it.label;
        b.onclick = () => it.action();
        quick.appendChild(b);
      });
    }
    async function botTypingThen(html, quote) {
      const t = document.createElement("div");
      t.className = "msg bot";
      t.innerHTML = `<div class="who">Assistente</div>…`;
      win.appendChild(t);
      win.scrollTop = win.scrollHeight;
      await sleep(500 + Math.random() * 400);
      win.removeChild(t);
      botSay(html, quote);
    }

    function quoteCard(product, qty) {
      const sub = product.price * qty;
      return `<div class="quote-card">
        <div class="q-item"><span>${esc(product.name)}</span><span>${BRL(product.price)}</span></div>
        <div class="q-item"><span>Quantidade</span><span>${qty} un.</span></div>
        <div class="q-item"><span>Frete (simulado)</span><span>Grátis</span></div>
        <div class="q-total"><span>Total</span><span>${BRL(sub)}</span></div>
      </div>`;
    }

    async function askName() {
      ctx.step = "name";
      setQuick([]);
      await botTypingThen("Antes de continuar, como devo te chamar?");
    }
    async function askDoc() {
      ctx.step = "doc";
      await botTypingThen(`Ótimo, ${esc(ctx.name)}! Para localizar seu cadastro, me informe seu <strong>CPF</strong> ou <strong>CNPJ</strong>.`);
    }
    async function askType() {
      ctx.step = "type";
      await botTypingThen("Perfeito! Como posso te ajudar agora?",
        quickBar([
          { label: "Fazer orçamento", action: startQuote },
          { label: "Status do pedido", action: startStatus },
          { label: "Falar com atendente", action: talkHuman },
        ]));
    }

    function quickBar(items) {
      setQuick(items.map((it) => ({ label: it.label, action: () => { userSay(it.label); it.action(); } })));
      return "";
    }

    async function startQuote() {
      ctx.step = "quote";
      await botTypingThen("Aqui está nosso catálogo em destaque. Escolha um item para gerar a proposta:");
      listProducts();
    }
    function listProducts() {
      setQuick(MOCK_PRODUCTS.map((p) => ({
        label: p.name.split(" (")[0],
        action: () => chooseProduct(p),
      })));
    }
    async function chooseProduct(p) {
      userSay(p.name);
      ctx.step = "quote-qty";
      await botTypingThen(`Ótima escolha! Quantas unidades de <strong>${esc(p.name)}</strong> você deseja? (sugerimos 10)`);
      setQuick([
        { label: "10 un.", action: () => confirmQuote(p, 10) },
        { label: "50 un.", action: () => confirmQuote(p, 50) },
        { label: "100 un.", action: () => confirmQuote(p, 100) },
      ]);
    }
    async function confirmQuote(p, qty) {
      userSay(qty + " un.");
      await botTypingThen(`Gerando proposta para ${qty} un. de ${esc(p.name)}...`);
      botSay(`<strong>Proposta comercial (simulada)</strong>`, quoteCard(p, qty));
      await botTypingThen("Deseja que eu registre este lead no CRM e envie a proposta por e-mail?",
        quickBar([
          { label: "Enviar proposta", action: () => sendProposal(p, qty) },
          { label: "Outro produto", action: startQuote },
          { label: "Ver status de pedido", action: startStatus },
        ]));
    }
    async function sendProposal(p, qty) {
      userSay("Enviar proposta");
      await botTypingThen("Proposta enviada com sucesso! Um consultor entrará em contato em breve. Anote o protocolo <strong>#ORÇ-" + (1000 + Math.floor(Math.random() * 9000)) + "</strong>.");
      await botTypingThen("Posso ajudar com algo mais?",
        quickBar([
          { label: "Novo orçamento", action: startQuote },
          { label: "📦 Status de pedido", action: startStatus },
          { label: "Encerrar", action: endChat },
        ]));
    }

    async function startStatus() {
      ctx.step = "status-id";
      await botTypingThen("Claro! Informe o número do pedido (ex.: <strong>10482</strong>).");
      setQuick([
        { label: "Pedido #10482", action: () => lookupOrder("10482") },
        { label: "Pedido #10501", action: () => lookupOrder("10501") },
        { label: "Pedido #10390", action: () => lookupOrder("10390") },
      ]);
    }
    async function lookupOrder(id) {
      userSay("Pedido #" + id);
      const ord = MOCK_ORDERS[id];
      if (!ord) {
        await botTypingThen("Não encontrei esse pedido. Tente #10482, #10501 ou #10390.");
        return;
      }
      await botTypingThen(`Localizei o pedido <strong>#${id}</strong> (${esc(ord.client)}). Status atual: <strong>${ord.status}</strong>.`);
      const rows = ord.steps.map((s) => `
        <div class="track-step ${s.state === "done" ? "done" : s.state === "current" ? "current" : ""}">
          <div class="track-dot">${s.state === "todo" ? "" : (s.state === "done" ? "✓" : "•")}</div>
          <div class="track-body"><h4>${s.label}</h4><p>${s.desc}</p></div>
        </div>`).join("");
      botSay(`<strong>Linha do tempo</strong><div class="track">${rows}</div><div class="muted" style="font-size:13px;">Valor total: <strong>${ord.total}</strong></div>`);
      await botTypingThen("Posso ajudar com mais alguma coisa?",
        quickBar([
          { label: "Fazer orçamento", action: startQuote },
          { label: "Outro pedido", action: startStatus },
          { label: "Encerrar", action: endChat },
        ]));
    }

    async function talkHuman() {
      userSay("Falar com atendente");
      ctx.step = "human";
      await botTypingThen("Você foi direcionado para um atendente humano. ⏱️ Tempo estimado: <strong>2 min</strong>. Enquanto isso, posso continuar ajudando com orçamento ou status.");
      setQuick([
        { label: "Fazer orçamento", action: startQuote },
        { label: "📦 Status de pedido", action: startStatus },
      ]);
    }
    async function endChat() {
      userSay("Encerrar");
      await botTypingThen("Obrigado! Sua conversa foi registrada para follow-up no CRM. Tenha um ótimo dia! 👋");
      setQuick([]);
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      input.value = "";
      userSay(val);

      if (ctx.step === "name") { ctx.name = val; return askDoc(); }
      if (ctx.step === "doc") { ctx.doc = val; return askType(); }
      if (ctx.step === "status-id") { return lookupOrder(val.replace(/[^0-9]/g, "")); }
      if (ctx.step === "quote-qty") {
        const n = parseInt(val, 10);
        if (isNaN(n) || n <= 0) { await botTypingThen("Digite um número válido de unidades."); return; }
        return confirmQuote(ctx.lastProduct || MOCK_PRODUCTS[0], n);
      }
      await botTypingThen("Entendi! Para seguir, escolha uma opção abaixo",
        quickBar([
          { label: "Fazer orçamento", action: startQuote },
          { label: "📦 Status de pedido", action: startStatus },
        ]));
    });

    (async () => {
      await botTypingThen("Olá! Eu sou o assistente virtual da <strong>Dental Imperador</strong>.");
      await botTypingThen("Posso te ajudar com orçamentos e status de pedidos em segundos. Para começar, qual o seu nome?");
      setQuick([
        { label: "Começar agora", action: askName },
        { label: "Fazer orçamento", action: () => { ctx.name = "Cliente"; askDoc(); } },
        { label: "📦 Status de pedido", action: startStatus },
      ]);
    })();
  }

  return { init };
})();
