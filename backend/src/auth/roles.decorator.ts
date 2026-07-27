import { SetMetadata } from "@nestjs/common";

export type Role = "CLIENT" | "GESTOR" | "OPERATOR";

export const ROLES_KEY = "roles";
export const PERMISSIONS_KEY = "permissions";

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);
