import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth";

const OPERATOR_LINKS = [
  { to: "/operator", label: "Picking", icon: "📦", exact: true },
  { to: "/operator/crm", label: "CRM", icon: "👥" },
  { to: "/operator/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/operator/perfil", label: "Perfil", icon: "👤" },
];

export function OperatorLayout() {
  const { userData, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" style={{ background: "#2e1a1a" }}>
        <div className="admin-sidebar-header">
          <h2>Operador</h2>
          <p className="admin-sidebar-user">{userData?.nome || "Operador"}</p>
        </div>
        <nav className="admin-sidebar-nav">
          {OPERATOR_LINKS.map((link) => {
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
          <div className="admin-header-left"><h3>{location.pathname.includes("/operator/crm") ? "CRM" : location.pathname.includes("/operator/dashboard") ? "Dashboard" : location.pathname.includes("/operator/perfil") ? "Perfil" : "Picking"}</h3></div>
        </header>
        <main className="admin-main"><Outlet /></main>
      </div>
    </div>
  );
}
