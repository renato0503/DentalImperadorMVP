import { Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { FLEXTOTAL_CONFIG } from "./flextotal.config";
import * as admin from "firebase-admin";

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

export function buildImageAuthHeaders(): Record<string, string> {
  return {
    Authorization: FLEXTOTAL_CONFIG.auth.authorization,
    Cookie: FLEXTOTAL_CONFIG.auth.cookie,
  };
}

export function formatDate(date: Date): string {
  const d = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  return d;
}

export function formatISO(date: Date): string {
  return date.toISOString();
}

export async function fetchImageFromUrl(
  httpService: HttpService,
  url: string,
): Promise<Buffer | null> {
  try {
    const headers = buildImageAuthHeaders();
    const response = await firstValueFrom(
      httpService.get(url, { headers, responseType: "arraybuffer", timeout: 30000 }),
    );
    return Buffer.from(response.data);
  } catch (error) {
    logger.error(`Erro ao baixar imagem de ${url}: ${(error as Error).message}`);
    return null;
  }
}

export async function uploadBufferToStorage(
  buffer: Buffer,
  filePath: string,
  contentType: string = "image/jpeg",
): Promise<string | null> {
  try {
    const bucket = admin.storage().bucket(FLEXTOTAL_CONFIG.firebase.storageBucket);
    const fullPath = `${FLEXTOTAL_CONFIG.firebase.imagesPath}/${filePath}`;
    const file = bucket.file(fullPath);

    await file.save(buffer, {
      metadata: { contentType },
    });

    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${FLEXTOTAL_CONFIG.firebase.storageBucket}/${fullPath}`;
    logger.log(`Imagem enviada: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    logger.error(`Erro ao enviar imagem para storage: ${(error as Error).message}`);
    return null;
  }
}

export async function uploadBase64ToStorage(
  base64: string,
  filePath: string,
): Promise<string | null> {
  try {
    const matches = base64.match(/^data:image\/([\w]+);base64,(.+)$/);
    const buffer = matches
      ? Buffer.from(matches[2], "base64")
      : Buffer.from(base64, "base64");
    const ext = matches ? matches[1] : "jpg";
    const contentType = `image/${ext === "jpg" ? "jpeg" : ext}`;
    const fileName = `${filePath}.${ext}`;

    return await uploadBufferToStorage(buffer, fileName, contentType);
  } catch (error) {
    logger.error(`Erro ao processar base64 para storage: ${(error as Error).message}`);
    return null;
  }
}

export function sanitizeFileName(sku: string, index: number = 0): string {
  const clean = sku.replace(/[^a-zA-Z0-9_-]/g, "_");
  return index > 0 ? `${clean}_${index}` : clean;
}
