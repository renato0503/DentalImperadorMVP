import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { NotificationBell } from "../notifications/NotificationBell";

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { to: "/admin/sync", label: "Sincronia ERP", icon: "🔄" },
  { to: "/admin/produtos", label: "Produtos", icon: "📦" },
  { to: "/admin/clientes", label: "Clientes", icon: "👥" },
];

export function AdminLayout() {
  const { userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = ADMIN_LINKS.find(
    (l) => l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to)
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img src="/logodental.png" alt="Dental Imperador" className="admin-sidebar-logo" />
          <div className="admin-sidebar-header-info">
            <strong>Admin</strong>
            <span>{userData?.nome || "Administrador"}</span>
          </div>
        </div>
        <div className="admin-sidebar-section-title">Painel</div>
        <nav className="admin-sidebar-nav">
          {ADMIN_LINKS.map((link) => {
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
            <h3>{currentPage?.label || "Dashboard"}</h3>
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
