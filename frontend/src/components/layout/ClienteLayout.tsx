import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth";

const TABS = [
  { to: "/cliente/painel", label: "Início", icon: "🏠", exact: true },
  { to: "/cliente/pedidos", label: "Pedidos", icon: "📦" },
  { to: "/cliente/orcamentos", label: "Orçamentos", icon: "📋" },
  { to: "/cliente/chat", label: "Chat", icon: "💬" },
  { to: "/cliente/perfil", label: "Perfil", icon: "👤" },
];

export function ClienteLayout() {
  const { userData, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="cliente-layout">
      <header className="cliente-header">
        <div className="cliente-header-left">
          <img src="/logodental.png" alt="Dental Imperador" style={{ height: 28, marginRight: 8 }} />
          <strong>Dental Imperador</strong>
        </div>
        <div className="cliente-header-right">
          <span style={{ fontSize: 13, color: "var(--cinza-medio)" }}>{userData?.nome}</span>
          <button className="btn btn-sm btn-outline" onClick={logout} style={{ marginLeft: 12 }}>
            Sair
          </button>
        </div>
      </header>

      <main className="cliente-main">
        <Outlet />
      </main>

      <nav className="cliente-nav">
        {TABS.map((tab) => {
          const isActive = tab.exact
            ? location.pathname === tab.to
            : location.pathname.startsWith(tab.to);
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={`cliente-nav-item ${isActive ? "active" : ""}`}
            >
              <span className="cliente-nav-icon">{tab.icon}</span>
              <span className="cliente-nav-label">{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
