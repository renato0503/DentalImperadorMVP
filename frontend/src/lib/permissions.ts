import type { UserRole } from "./auth";
import { useAuth } from "./auth";

export type Resource =
  | "gestao" | "gestao.financeiro" | "gestao.crm" | "gestao.equipe"
  | "gestao.churn" | "gestao.relatorios" | "gestao.config"
  | "operacao" | "operacao.crm"
  | "chatbot" | "orcamento" | "pedido";

interface RoleDefinition {
  resources: Resource[];
  label: string;
  home: string;
}

const ROLES: Record<UserRole, RoleDefinition> = {
  admin: {
    label: "Administrador",
    home: "/gestao",
    resources: [
      "gestao", "gestao.financeiro", "gestao.crm", "gestao.equipe",
      "gestao.churn", "gestao.relatorios", "gestao.config",
      "operacao", "operacao.crm",
      "chatbot", "orcamento", "pedido",
    ],
  },
  manager: {
    label: "Gerente",
    home: "/gestao",
    resources: [
      "gestao", "gestao.crm", "gestao.equipe",
      "gestao.churn", "gestao.relatorios",
      "chatbot", "orcamento", "pedido",
    ],
  },
  operator: {
    label: "Operador",
    home: "/operacao",
    resources: [
      "operacao", "operacao.crm",
      "chatbot", "orcamento", "pedido",
    ],
  },
  cliente: {
    label: "Cliente",
    home: "/meu-painel",
    resources: ["chatbot", "orcamento", "pedido"],
  },
};

export function usePermission() {
  const { userData } = useAuth();
  const role: UserRole = userData?.papel || "cliente";
  const def = ROLES[role];

  return {
    can: (resource: Resource): boolean => {
      return def.resources.includes(resource);
    },
    role,
    label: def.label,
    home: def.home,
    isGestor: role === "admin" || role === "manager",
  };
}

export function hasPermission(role: UserRole, resource: Resource): boolean {
  return ROLES[role]?.resources.includes(resource) ?? false;
}

export function getModules(role: UserRole) {
  const def = ROLES[role];
  return def.resources;
}
