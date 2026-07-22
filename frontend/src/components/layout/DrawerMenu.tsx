import { useAuth, type UserRole } from "../../lib/auth";

interface DrawerLink {
  href: string;
  label: string;
  icon: string;
  roles?: UserRole[];
}

const DRAWER_LINKS: DrawerLink[] = [
  { href: "/", label: "Início", icon: "home", roles: ["admin", "manager", "operator", "cliente"] },
  { href: "/chatbot", label: "Chatbot", icon: "chat", roles: ["admin", "manager", "operator", "cliente"] },
  { href: "/orcamento", label: "Orçamento", icon: "file", roles: ["admin", "manager", "operator", "cliente"] },
  { href: "/pedido", label: "Status", icon: "box", roles: ["admin", "manager", "operator", "cliente"] },
  { href: "/picking", label: "Picking", icon: "box", roles: ["admin", "manager", "operator"] },
  { href: "/churn", label: "Churn", icon: "activity", roles: ["admin", "manager"] },
  { href: "/campanhas", label: "Campanhas", icon: "send", roles: ["admin", "manager"] },
  { href: "/dashboard", label: "Dashboard", icon: "bar-chart", roles: ["admin", "manager", "operator"] },
  { href: "/relatorios", label: "Relatórios", icon: "file", roles: ["admin", "manager", "operator"] },
  { href: "/crm", label: "CRM", icon: "users", roles: ["admin", "manager", "operator"] },
  { href: "/admin", label: "Admin", icon: "shield", roles: ["admin"] },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DrawerMenu({ open, onClose }: Props) {
  const { user, userData, logout, isAdmin } = useAuth();
  const path = window.location.pathname;
  const role = userData?.papel || "cliente";

  if (!open) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="drawer-menu" role="dialog" aria-label="Menu de navegação">
        <div className="drawer-header">
          <img src="/logodental.png" alt="" />
          <div>
            <div className="drawer-user-name">{userData?.nome || user?.email || "Visitante"}</div>
            <div className="drawer-user-role">{isAdmin ? "Administrador" : role}</div>
          </div>
        </div>

        <nav>
          {DRAWER_LINKS.filter((l) => !l.roles || l.roles.includes(role)).map(
            (link) => (
              <a
                key={link.href}
                href={link.href}
                className={`drawer-link${path === link.href ? " active" : ""}`}
                data-icon={link.icon}
                onClick={onClose}
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {user && (
          <>
            <div className="drawer-divider" />
            <button
              className="drawer-link"
              data-icon="log-out"
              onClick={handleLogout}
              style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", font: "inherit" }}
            >
              Sair
            </button>
          </>
        )}
      </aside>
    </>
  );
}
