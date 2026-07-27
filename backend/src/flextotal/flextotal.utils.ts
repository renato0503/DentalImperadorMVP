import { Logger } from "@nestjs/common";
import { FLEXTOTAL_CONFIG } from "./flextotal.config";

const logger = new Logger("FlexTotalUtils");

export function calculateTotalPages(totalRegistros: string, pageSize: number): number {
  const total = parseInt(totalRegistros, 10);
  if (isNaN(total) || total <= 0) return 0;
  return Math.ceil(total / pageSize);
}

export function hasMorePages(currentPage: number, totalRegistros: string, pageSize: number): boolean {
  const totalPages = calculateTotalPages(totalRegistros, pageSize);
  return currentPage < totalPages;
}

export function buildAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: FLEXTOTAL_CONFIG.auth.authorization,
    "Content-Type": "application/json",
    Connection: "keep-alive",
  };
  if (FLEXTOTAL_CONFIG.auth.cookie) {
    headers["Cookie"] = FLEXTOTAL_CONFIG.auth.cookie;
  } else {
    logger.warn("FLEXTOTAL_COOKIE não configurado — alguns endpoints do ERP podem rejeitar a requisição");
  }
  return headers;
}

export function formatDate(date: Date): string {
  const d = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  return d;
}
