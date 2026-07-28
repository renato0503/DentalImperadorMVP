import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { usePermission, type Resource } from "../../lib/permissions";
import { NotificationBell } from "../notifications/NotificationBell";

interface ModuleLink {
  to: string;
  label: string;
  icon: string;
  resource: Resource;
  exact?: boolean;
}

interface Module {
  section: string;
  links: ModuleLink[];
}

const MODULES: Module[] = [
  {
    section: "Dashboard",
    links: [
      { to: "/gestao", label: "Dashboard Executivo", icon: "📊", resource: "gestao", exact: true },
    ],
  },
  {
    section: "Gestão",
    links: [
      { to: "/gestao/crm", label: "CRM & Funil", icon: "👥", resource: "gestao.crm" },
      { to: "/gestao/equipe", label: "Equipe & Metas", icon: "🏆", resource: "gestao.equipe" },
      { to: "/gestao/churn", label: "Retenção", icon: "⚠️", resource: "gestao.churn" },
    ],
  },
  {
    section: "Relatórios",
    links: [
      { to: "/gestao/relatorios", label: "Relatórios", icon: "📄", resource: "gestao.relatorios" },
      { to: "/gestao/metricas", label: "Métricas de Vendas", icon: "📈", resource: "gestao.relatorios" },
    ],
  },
  {
    section: "Operações",
    links: [
      { to: "/gestao/produtos", label: "Produtos", icon: "📦", resource: "gestao" },
      { to: "/gestao/clientes", label: "Clientes", icon: "👥", resource: "gestao" },
    ],
  },
  {
    section: "Sistema",
    links: [
      { to: "/gestao/sync", label: "Sincronia ERP", icon: "🔄", resource: "gestao.config" },
      { to: "/gestao/usuarios", label: "Usuários", icon: "🔐", resource: "gestao.config" },
    ],
  },
];

export function GestaoLayout() {
  const { userData, logout } = useAuth();
  const { can } = usePermission();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allLinks = MODULES.flatMap((m) => m.links);
  const current = allLinks.find((l) =>
    l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to)
  );

  const handleNavClick = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
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
                    <NavLink key={link.to} to={link.to} onClick={handleNavClick}
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
            <h3>{current?.label || "Dashboard Executivo"}</h3>
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
