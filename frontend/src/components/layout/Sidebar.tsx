import { useAuth, type UserRole } from "../../lib/auth";
import { ROLE_HOME } from "../../lib/auth";

interface SidebarLink {
  href: string; label: string; icon: string; roles?: UserRole[];
}

interface SidebarSection {
  title?: string; links: SidebarLink[];
}

const LINKS: SidebarSection[] = [
  { links: [
    { href: "/chatbot", label: "Chatbot", icon: "message-circle" },
    { href: "/orcamento", label: "Orçamento", icon: "file-text" },
    { href: "/pedido", label: "Status Pedido", icon: "package" },
  ]},
  { title: "MINHA CONTA", links: [
    { href: "/meu-painel", label: "Meu Painel", icon: "home", roles: ["cliente"] },
    { href: "/perfil", label: "Perfil", icon: "users" },
  ]},
];

export function Sidebar() {
  const { userData } = useAuth();
  const path = window.location.pathname;
  const role: UserRole = userData?.papel || "cliente";

  const sections = LINKS.map((s) => ({
    ...s,
    links: s.links
      .filter((l) => !l.roles || l.roles.includes(role))
      .concat(
        role !== "cliente" && s.title === "MINHA CONTA"
          ? [{ href: ROLE_HOME[role], label: "Painel Admin", icon: "shield" as const }]
          : []
      ),
  }));

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
            {section.links.map((link) => (
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
