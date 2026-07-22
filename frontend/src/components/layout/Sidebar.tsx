import { useAuth } from "../../lib/auth";

const links = [
  { href: "/", label: "Início", icon: "home" },
  { href: "/chatbot", label: "Chatbot", icon: "message-circle" },
  { href: "/orcamento", label: "Orçamento", icon: "file-text" },
  { href: "/pedido", label: "Status de Pedido", icon: "package" },
  { href: "/picking", label: "Picking", icon: "box" },
  { href: "/churn", label: "Churn", icon: "activity" },
  { href: "/campanhas", label: "Campanhas", icon: "send" },
  { href: "/dashboard", label: "Dashboard", icon: "bar-chart" },
  { href: "/relatorios", label: "Relatórios", icon: "file-text" },
  { href: "/crm", label: "CRM", icon: "users" },
];

export function Sidebar() {
  const { user } = useAuth();
  const path = window.location.pathname;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`sidebar-link${path === link.href ? " active" : ""}`}
            data-icon={link.icon}
          >
            {link.label}
          </a>
        ))}
      </nav>
      {!user && (
        <div className="sidebar-cta">
          <p>Faça login para acessar todas as funcionalidades</p>
          <a className="btn btn-primary" href="/login">
            Entrar
          </a>
        </div>
      )}
    </aside>
  );
}
