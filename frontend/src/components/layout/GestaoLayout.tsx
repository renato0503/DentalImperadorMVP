import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { usePermission } from "../../lib/permissions";
import { NotificationBell } from "../notifications/NotificationBell";

const MODULES = [
  {
    section: "Dashboard",
    links: [
      { to: "/gestao", label: "Dashboard Executivo", icon: "📊", resource: "gestao" as const, exact: true },
    ],
  },
  {
    section: "Gestão",
    links: [
      { to: "/gestao/crm", label: "CRM & Funil", icon: "👥", resource: "gestao.crm" as const },
      { to: "/gestao/equipe", label: "Equipe & Metas", icon: "🏆", resource: "gestao.equipe" as const },
      { to: "/gestao/churn", label: "Retenção", icon: "⚠️", resource: "gestao.churn" as const },
    ],
  },
  {
    section: "Relatórios",
    links: [
      { to: "/gestao/relatorios", label: "Relatórios", icon: "📄", resource: "gestao.relatorios" as const },
      { to: "/gestao/metricas", label: "Métricas de Vendas", icon: "📈", resource: "gestao.relatorios" as const },
    ],
  },
  {
    section: "Operações",
    links: [
      { to: "/gestao/produtos", label: "Produtos", icon: "📦", resource: "gestao" as const },
      { to: "/gestao/clientes", label: "Clientes", icon: "👥", resource: "gestao" as const },
    ],
  },
  {
    section: "Sistema",
    links: [
      { to: "/gestao/sync", label: "Sincronia ERP", icon: "🔄", resource: "gestao.config" as const },
      { to: "/gestao/usuarios", label: "Usuários", icon: "🔐", resource: "gestao.config" as const },
    ],
  },
];

export function GestaoLayout() {
  const { userData, logout } = useAuth();
  const { can } = usePermission();
  const location = useLocation();
  const navigate = useNavigate();

  const allLinks = MODULES.flatMap((m) => m.links);
  const current = allLinks.find((l) =>
    l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to)
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img src="/logodental.png" alt="Dental Imperador" className="admin-sidebar-logo" />
          <div className="admin-sidebar-header-info">
            <strong>Gestão</strong>
            <span>{userData?.nome || "Usuário"}</span>
          </div>
        </div>

        {MODULES.map((mod) => {
          const visible = mod.links.filter((l) => can(l.resource));
          if (visible.length === 0) return null;
          return (
            <div key={mod.section}>
              <div className="admin-sidebar-section-title">{mod.section}</div>
              <nav className="admin-sidebar-nav">
                {visible.map((link) => {
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
            </div>
          );
        })}

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
            <h3>{current?.label || "Dashboard Executivo"}</h3>
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
