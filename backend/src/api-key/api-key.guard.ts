import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

const API_KEYS = new Map<string, { client: string; tier: "basic" | "premium" }>([
  ["demo-key-2026", { client: "Cliente Demonstração", tier: "basic" }],
]);

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["x-api-key"];

    if (!apiKey) {
      throw new UnauthorizedException("API key é obrigatória (header x-api-key)");
    }

    const client = API_KEYS.get(apiKey);
    if (!client) {
      throw new UnauthorizedException("API key inválida");
    }

    request.apiClient = client;
    return true;
  }
}

export function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `di-${key}`;
}
