import { useAuth, type UserRole } from "../../lib/auth";

interface SidebarLink {
  href: string; label: string; icon: string; roles?: UserRole[];
}

interface SidebarSection {
  title?: string; links: SidebarLink[];
}

const CLIENTE_LINKS: SidebarSection[] = [
  { links: [
    { href: "/meu-painel", label: "Meu Painel", icon: "home", roles: ["admin", "manager", "operator", "cliente"] },
    { href: "/chatbot", label: "Chatbot", icon: "message-circle", roles: ["admin", "manager", "operator", "cliente"] },
    { href: "/orcamento", label: "Orçamento", icon: "file-text", roles: ["admin", "manager", "operator", "cliente"] },
    { href: "/pedido", label: "Status", icon: "package", roles: ["admin", "manager", "operator", "cliente"] },
  ]},
  { title: "CONTA", links: [
    { href: "/perfil", label: "Perfil", icon: "users", roles: ["admin", "manager", "operator", "cliente"] },
  ]},
];

const STAFF_LINKS: SidebarSection[] = [
  { title: "DASHBOARDS", links: [
    { href: "/admin", label: "Admin", icon: "shield", roles: ["admin"] },
    { href: "/dashboard", label: "Comercial", icon: "bar-chart", roles: ["admin", "manager", "operator"] },
    { href: "/relatorios", label: "Relatórios", icon: "file-text", roles: ["admin", "manager", "operator"] },
  ]},
  { title: "GESTÃO", links: [
    { href: "/crm", label: "CRM", icon: "users", roles: ["admin", "manager", "operator"] },
    { href: "/churn", label: "Churn", icon: "activity", roles: ["admin", "manager"] },
    { href: "/campanhas", label: "Campanhas", icon: "send", roles: ["admin", "manager"] },
  ]},
  { title: "OPERAÇÕES", links: [
    { href: "/picking", label: "Picking", icon: "box", roles: ["admin", "manager", "operator"] },
  ]},
  { title: "SISTEMA", links: [
    { href: "/perfil", label: "Perfil", icon: "users", roles: ["admin", "manager", "operator"] },
  ]},
];

export function Sidebar() {
  const { userData } = useAuth();
  const path = window.location.pathname;
  const role: UserRole = userData?.papel || "cliente";

  const sections = role === "cliente" ? CLIENTE_LINKS : STAFF_LINKS;

  const isActive = (href: string) => {
    if (path === href) return true;
    if (href !== "/" && path.startsWith(href)) return true;
    return false;
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {sections.map((section, i) => (
          <div key={i}>
            {section.title && <div className="sidebar-section-title">{section.title}</div>}
            {section.links
              .filter((l) => !l.roles || l.roles.includes(role))
              .map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`sidebar-link${isActive(link.href) ? " active" : ""}`}
                  data-icon={link.icon}
                >
                  {link.label}
                </a>
              ))}
          </div>
        ))}
      </nav>
      {!userData && (
        <div className="sidebar-cta">
          <p>Faça login para acessar todas as funcionalidades</p>
          <a className="btn btn-primary" href="/login">Entrar</a>
        </div>
      )}
    </aside>
  );
}
