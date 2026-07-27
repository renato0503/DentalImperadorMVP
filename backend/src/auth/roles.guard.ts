import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../prisma/prisma.service";
import { ROLES_KEY, PERMISSIONS_KEY, type Role } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const apiClient = request.apiClient;

    if (apiClient) return true;

    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ForbiddenException("Token de autenticação não fornecido");
    }

    const token = authHeader.split(" ")[1];

    try {
      const uid = await this.resolveUid(token);
      if (!uid) throw new ForbiddenException("Token inválido");

      const user = await this.prisma.user.findUnique({
        where: { uid },
        select: { role: true, permissions: true, ativo: true },
      });

      if (!user || !user.ativo) {
        throw new ForbiddenException("Usuário não encontrado ou inativo");
      }

      request.user = { uid, role: user.role, permissions: user.permissions };

      if (requiredRoles && requiredRoles.length > 0) {
        const hasRole = requiredRoles.includes(user.role as Role);
        if (!hasRole) {
          this.logger.warn(`Acesso negado: ${uid} (${user.role}) não tem role ${requiredRoles}`);
          throw new ForbiddenException("Acesso não autorizado para esta função");
        }
      }

      if (requiredPermissions && requiredPermissions.length > 0) {
        let userPermissions: string[];
        try { userPermissions = JSON.parse(user.permissions); }
        catch { userPermissions = []; }

        const hasPermission = requiredPermissions.some((p) => userPermissions.includes(p));
        if (!hasPermission) {
          this.logger.warn(`Acesso negado: ${uid} não tem permissão ${requiredPermissions}`);
          throw new ForbiddenException("Permissão insuficiente");
        }
      }

      return true;
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
      this.logger.error(`Erro na autenticação: ${(err as Error).message}`);
      throw new ForbiddenException("Erro de autenticação");
    }
  }

  private async resolveUid(token: string): Promise<string | null> {
    try {
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      return payload.user_id || payload.sub || null;
    } catch {
      return token;
    }
  }
}
