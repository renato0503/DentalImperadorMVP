import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { NotificationBell } from "../notifications/NotificationBell";

const OPERATOR_LINKS = [
  { to: "/operacao", label: "Picking", icon: "📦", exact: true },
  { to: "/operacao/crm", label: "CRM", icon: "👥" },
  { to: "/operacao/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/operacao/perfil", label: "Perfil", icon: "👤" },
];

export function OperatorLayout() {
  const { userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPage = OPERATOR_LINKS.find(
    (l) => l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to)
  );

  const handleNavClick = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar operator-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="admin-sidebar-header">
          <img src="/logodental.png" alt="Dental Imperador" className="admin-sidebar-logo" />
          <div className="admin-sidebar-header-info">
            <strong>Operador</strong>
            <span>{userData?.nome || "Operador"}</span>
          </div>
        </div>
        <div className="admin-sidebar-section-title">Operação</div>
        <nav className="admin-sidebar-nav">
          {OPERATOR_LINKS.map((link) => {
            const isActive = link.exact
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);
            return (
              <NavLink key={link.to} to={link.to} onClick={handleNavClick}
                className={`admin-sidebar-link ${isActive ? "active" : ""}`}>
                <span className="admin-sidebar-icon">{link.icon}</span>
                {link.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-sidebar-link sidebar-footer-link" onClick={handleNavClick}>← Voltar ao site</NavLink>
          <button className="btn btn-sm btn-outline sidebar-logout" onClick={logout}>Sair</button>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="admin-content">
        <header className="admin-header">
          <button className="admin-header-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Abrir menu">
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
          <div className="admin-header-brand">
            <img src="/logodental.png" alt="" />
            <strong>Dental Imperador</strong>
          </div>
          <div className="admin-header-center">
            <h3>{currentPage?.label || "Picking"}</h3>
          </div>
          <div className="admin-header-right">
            <NotificationBell />
            <span className="admin-header-user" onClick={() => navigate("/perfil")}>
              {userData?.nome}
            </span>
          </div>
        </header>
        <main className="admin-main"><Outlet /></main>
      </div>
    </div>
  );
}
