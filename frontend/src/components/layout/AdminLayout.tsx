import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { NotificationBell } from "../notifications/NotificationBell";
import { usePermission } from "../../lib/permissions";

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
          <h2>Admin</h2>
          <p className="admin-sidebar-user">{userData?.nome || "Admin"}</p>
        </div>
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
          <NavLink to="/" className="admin-sidebar-link">← Voltar ao site</NavLink>
          <button className="btn btn-sm btn-outline" onClick={logout} style={{ marginTop: 8, width: "100%" }}>Sair</button>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-header">
          <div className="admin-header-left">
            <h3>{currentPage?.label || "Dashboard"}</h3>
          </div>
          <div className="admin-header-right">
            <NotificationBell />
            <button className="btn btn-sm btn-ghost" onClick={() => navigate("/perfil")} style={{ fontSize: 13 }}>
              {userData?.nome}
            </button>
          </div>
        </header>
        <main className="admin-main"><Outlet /></main>
      </div>
    </div>
  );
}
