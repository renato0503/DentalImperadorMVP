import { useAuth, type UserRole } from "../../lib/auth";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Início", icon: "home", roles: ["admin", "manager", "operator", "cliente"] },
  { href: "/chatbot", label: "Chat", icon: "message-circle", roles: ["admin", "manager", "operator", "cliente"] },
  { href: "/dashboard", label: "Dashboard", icon: "bar-chart", roles: ["admin", "manager", "operator"] },
  { href: "/crm", label: "CRM", icon: "users", roles: ["admin", "manager", "operator"] },
  { href: "/admin", label: "Admin", icon: "shield", roles: ["admin"] },
];

export function MobileNav() {
  const { userData } = useAuth();
  const path = window.location.pathname;
  const role = userData?.papel || "cliente";

  const visible = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <nav className="mobile-nav" role="tablist" aria-label="Navegação principal">
      {visible.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`mobile-nav-link${path === item.href ? " active" : ""}`}
          data-icon={item.icon}
          role="tab"
          aria-selected={path === item.href}
          aria-label={item.label}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
