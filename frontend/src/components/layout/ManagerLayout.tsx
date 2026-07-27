import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth";

const MANAGER_LINKS = [
  { to: "/manager", label: "Dashboard", icon: "📊", exact: true },
  { to: "/manager/crm", label: "CRM", icon: "👥" },
  { to: "/manager/metricas", label: "Métricas", icon: "📈" },
  { to: "/manager/churn", label: "Churn", icon: "⚠️" },
  { to: "/manager/relatorios", label: "Relatórios", icon: "📄" },
];

export function ManagerLayout() {
  const { userData, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" style={{ background: "#1a3a2e" }}>
        <div className="admin-sidebar-header">
          <h2>Manager</h2>
          <p className="admin-sidebar-user">{userData?.nome || "Manager"}</p>
        </div>
        <nav className="admin-sidebar-nav">
          {MANAGER_LINKS.map((link) => {
            const isActive = link.exact
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);
            return (
              <NavLink key={link.to} to={link.to}
                className={`admin-sidebar-link ${isActive ? "active" : ""}`}>
                <span className="admin-sidebar-icon">{link.icon}</span>
                {link.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-sidebar-link">← Voltar ao site</NavLink>
          <button className="btn btn-sm btn-outline" onClick={logout} style={{ marginTop: 8, width: "100%" }}>Sair</button>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-header">
          <div className="admin-header-left"><h3>{location.pathname.includes("/manager/crm") ? "CRM" : location.pathname.includes("/manager/metricas") ? "Métricas" : location.pathname.includes("/manager/churn") ? "Churn" : location.pathname.includes("/manager/relatorios") ? "Relatórios" : "Dashboard"}</h3></div>
        </header>
        <main className="admin-main"><Outlet /></main>
      </div>
    </div>
  );
}
