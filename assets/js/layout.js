/* ============================================================
   DENTAL IMPERADOR — App shell (sidebar + topbar)
   Gera a navegação compartilhada em todas as telas do app.
   ============================================================ */
(function () {
  const LOGO = "assets/img/logodental.png";

  // Páginas do app (id, rótulo, ícone Lucide, arquivo)
  const PAGES = [
    { id: "landing",  label: "Início",            icon: "home",        href: "index.html" },
    { id: "chatbot",  label: "Chatbot",           icon: "message-square", href: "chatbot.html" },
    { id: "orcamento",label: "Orçamento",         icon: "calculator",  href: "orcamento.html" },
    { id: "pedido",   label: "Status de Pedido",  icon: "package",     href: "pedido.html" },
    { id: "dashboard",label: "Dashboard",         icon: "layout-dashboard", href: "dashboard.html" },
    { id: "crm",      label: "CRM / Kanban",      icon: "kanban",      href: "crm.html" },
  ];

  function mountShell(activeId) {
    const app = document.getElementById("app");
    if (!app) return;

    const page = PAGES.find((p) => p.id === activeId) || PAGES[0];

    const nav = PAGES.map((p) => `
      <a class="nav-item ${p.id === activeId ? "active" : ""}" href="${p.href}">
        <i data-lucide="${p.icon}"></i><span>${p.label}</span>
      </a>`).join("");

    app.innerHTML = `
      <aside class="sidebar">
        <div class="brand">
          <img src="${LOGO}" alt="Dental Imperador" />
          <span>Imperador</span>
        </div>
        <nav class="nav">
          <div class="nav-label">Plataforma</div>
          ${nav}
        </nav>
        <div class="side-foot">Dental Imperador · MVP estático</div>
      </aside>

      <div id="main-wrap">
        <header class="topbar">
          <div class="tb-left">
            <img class="tb-logo" src="${LOGO}" alt="" />
            <span class="tb-title">${page.label}</span>
          </div>
          <div class="tb-right">
            <span class="tb-icon" title="Notificações">
              <i data-lucide="bell"></i>
              <span class="badge">3</span>
            </span>
            <span class="tb-icon" title="Ajuda"><i data-lucide="help-circle"></i></span>
            <span class="avatar">DI</span>
          </div>
        </header>
        <main class="content" id="content"></main>
      </div>`;

    if (window.lucide) lucide.createIcons();
  }

  window.DI = { mountShell, PAGES, LOGO };
})();
