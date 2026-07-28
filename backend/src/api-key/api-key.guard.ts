import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

const DEFAULT_KEYS = {
  "demo-key-2026": { client: "Cliente Demonstração", tier: "basic" as const },
};

function loadKeys(): Record<string, { client: string; tier: "basic" | "premium" }> {
  try {
    const raw = process.env.API_KEYS;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed;
      }
    }
  } catch (e) {
    new Logger("ApiKeyGuard").warn("API_KEYS env inválido, usando fallback");
  }
  return DEFAULT_KEYS;
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

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

    const keys = loadKeys();
    const client = keys[apiKey];
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
