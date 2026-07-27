import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { NotificationBell } from "../notifications/NotificationBell";

const OPERATOR_LINKS = [
  { to: "/operator", label: "Picking", icon: "📦", exact: true },
  { to: "/operator/crm", label: "CRM", icon: "👥" },
  { to: "/operator/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/operator/perfil", label: "Perfil", icon: "👤" },
];

const pageTitle = (path: string) => {
  if (path.includes("/operator/crm")) return "CRM";
  if (path.includes("/operator/dashboard")) return "Dashboard";
  if (path.includes("/operator/perfil")) return "Perfil";
  return "Picking";
};

export function OperatorLayout() {
  const { userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" style={{ background: "#7c2d12" }}>
        <div className="admin-sidebar-header">
          <img src="/logodental.png" alt="Dental Imperador" className="admin-sidebar-logo" />
          <div className="admin-sidebar-header-info">
            <strong>Operador</strong>
            <span>{userData?.nome || "Operador"}</span>
          </div>
        </div>
        <div className="admin-sidebar-section-title">Painel</div>
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
          <NavLink to="/" className="admin-sidebar-link" style={{ fontSize: 12 }}>← Voltar ao site</NavLink>
          <button className="btn btn-sm btn-outline" onClick={logout}
            style={{ margin: "8px 12px 0", width: "calc(100% - 24px)", color: "rgba(255,255,255,.6)", borderColor: "rgba(255,255,255,.2)" }}>
            Sair
          </button>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-header">
          <div className="admin-header-brand">
            <img src="/logodental.png" alt="" />
            <strong>Dental Imperador</strong>
          </div>
          <div className="admin-header-center">
            <h3>{pageTitle(location.pathname)}</h3>
          </div>
          <div className="admin-header-right">
            <NotificationBell />
            <span className="admin-header-user" onClick={() => navigate("/perfil")} style={{ cursor: "pointer" }}>
              {userData?.nome}
            </span>
          </div>
        </header>
        <main className="admin-main"><Outlet /></main>
      </div>
    </div>
  );
}
