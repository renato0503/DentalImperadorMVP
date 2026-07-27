import "express";

declare module "express" {
  interface Request {
    user?: {
      uid: string;
      role: string;
      permissions: string;
    };
    apiClient?: { client: string; tier: string };
  }
}
