import type { UserRole } from "./auth";
import { useAuth } from "./auth";

export type Resource = "dashboard" | "crm" | "admin" | "churn" | "campanhas" | "chatbot" | "orcamento" | "pedido" | "picking" | "relatorios";

const PERMISSIONS: Record<UserRole, Resource[]> = {
  admin: ["dashboard", "crm", "admin", "churn", "campanhas", "chatbot", "orcamento", "pedido", "picking", "relatorios"],
  manager: ["dashboard", "crm", "churn", "campanhas", "chatbot", "orcamento", "pedido", "picking", "relatorios"],
  operator: ["dashboard", "crm", "chatbot", "orcamento", "pedido", "picking", "relatorios"],
  cliente: ["chatbot", "orcamento", "pedido"],
};

export function usePermission() {
  const { userData } = useAuth();
  const role: UserRole = userData?.papel || "cliente";

  return {
    can: (resource: Resource): boolean => {
      return PERMISSIONS[role]?.includes(resource) ?? false;
    },
    role,
    isAdmin: role === "admin",
    isManager: role === "manager" || role === "admin",
  };
}

export function hasPermission(role: UserRole, resource: Resource): boolean {
  return PERMISSIONS[role]?.includes(resource) ?? false;
}
