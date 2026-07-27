import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PrismaService } from "../prisma/prisma.service";
import { CacheService } from "../cache/cache.service";
import { FLEXTOTAL_CONFIG } from "./flextotal.config";
import { buildAuthHeaders, hasMorePages } from "./flextotal.utils";
import type {
  FlexTotalClientesRequest,
  FlexTotalClientesResponse,
  FlexTotalClientesItem,
  FlexTotalProdutosRequest,
  FlexTotalProdutosResponse,
  FlexTotalProdutosItem,
  FlexTotalEstoqueRequest,
  FlexTotalEstoqueResponse,
  FlexTotalEstoqueItem,
  FlexTotalFichaTecnicaRequest,
  FlexTotalFichaTecnicaResponse,
  SyncResult,
} from "./flextotal.types";

const LAST_SYNC_KEY_PRODUCTS = "flextotal:lastSync:products";
const LAST_SYNC_KEY_CLIENTS = "flextotal:lastSync:clients";
const LAST_SYNC_KEY_STOCK = "flextotal:lastSync:stock";

export interface SyncLogEntry {
  id: string;
  entity: string;
  status: string;
  startedAt: Date;
  finishedAt: Date | null;
  result: SyncResult | null;
  error: string | null;
}

@Injectable()
export class FlexTotalService {
  private readonly logger = new Logger(FlexTotalService.name);
  private readonly baseURL = FLEXTOTAL_CONFIG.baseURL;
  private readonly defaultPageSize = FLEXTOTAL_CONFIG.defaultPageSize;
  private runningSyncs = new Map<string, Promise<void>>();

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async startSync(entity: string): Promise<string> {
    const existing = this.runningSyncs.get(entity);
    if (existing) {
      const last = await this.prisma.syncLog.findFirst({
        where: { entity, status: { in: ["queued", "running"] } },
        orderBy: { startedAt: "desc" },
      });
      if (last) return last.id;
    }

    const log = await this.prisma.syncLog.create({
      data: { entity, status: "queued" },
    });

    const promise = this.runSync(entity, log.id);
    this.runningSyncs.set(entity, promise);
    promise.finally(() => this.runningSyncs.delete(entity));

    return log.id;
  }

  async getSyncStatus(id: string): Promise<SyncLogEntry | null> {
    const log = await this.prisma.syncLog.findUnique({ where: { id } });
    if (!log) return null;
    return {
      id: log.id,
      entity: log.entity,
      status: log.status,
      startedAt: log.startedAt,
      finishedAt: log.finishedAt,
      result: log.result ? JSON.parse(log.result) : null,
      error: log.error,
    };
  }

  async getLastSyncStatus(entity: string): Promise<SyncLogEntry | null> {
    const log = await this.prisma.syncLog.findFirst({
      where: { entity },
      orderBy: { startedAt: "desc" },
    });
    if (!log) return null;
    return {
      id: log.id,
      entity: log.entity,
      status: log.status,
      startedAt: log.startedAt,
      finishedAt: log.finishedAt,
      result: log.result ? JSON.parse(log.result) : null,
      error: log.error,
    };
  }

  private async runSync(entity: string, logId: string): Promise<void> {
    await this.prisma.syncLog.update({
      where: { id: logId },
      data: { status: "running", startedAt: new Date() },
    });

    try {
      let result: SyncResult | SyncResult[];

      switch (entity) {
        case "products":
          result = await this.syncProducts();
          break;
        case "clients":
          result = await this.syncClients();
          break;
        case "stock":
          result = await this.syncStock();
          break;
        case "tech-sheets":
          result = await this.syncTechSheets();
          break;
        case "all":
          result = await this.syncAll();
          break;
        default:
          throw new Error(`Entidade desconhecida: ${entity}`);
      }

      await this.prisma.syncLog.update({
        where: { id: logId },
        data: {
          status: "completed",
          finishedAt: new Date(),
          result: JSON.stringify(result),
        },
      });
    } catch (err) {
      await this.prisma.syncLog.update({
        where: { id: logId },
        data: {
          status: "failed",
          finishedAt: new Date(),
          error: (err as Error).message,
        },
      });
    }
  }

  async syncClients(): Promise<SyncResult> {
    const start = Date.now();
    const result: SyncResult = {
      success: true, entity: "customers", recordsProcessed: 0,
      recordsUpdated: 0, recordsCreated: 0, errors: [],
      durationMs: 0,
    };

    try {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const payload: FlexTotalClientesRequest = {
          PAGE: String(page),
          PAGE_SIZE: String(this.defaultPageSize),
        };

        const response = await this.callApi<FlexTotalClientesResponse>(
          FLEXTOTAL_CONFIG.endpoints.D17_CLIENTES,
          payload,
        );

        const clients = Array.isArray(response) ? response : [];
        result.recordsProcessed += clients.length;

        for (const c of clients) {
          try {
            const created = await this.upsertClient(c);
            if (created) result.recordsCreated++;
            else result.recordsUpdated++;
          } catch (err) {
            result.errors.push(`Cliente ${c.id_cliente}: ${(err as Error).message}`);
          }
        }

        const totalRegs = clients.length > 0 ? String(clients[0].total_registros ?? 0) : "0";
        hasMore = hasMorePages(page, totalRegs, this.defaultPageSize);
        page++;
      }

      await this.cache.set(LAST_SYNC_KEY_CLIENTS, new Date().toISOString());
      await this.cache.invalidate("flextotal:customers");
      this.eventEmitter.emit("flextotal.sync.customers.complete", { records: result.recordsProcessed });
    } catch (err) {
      result.success = false;
      result.errors.push((err as Error).message);
      this.logger.error("syncClients failed", (err as Error).message);
    }

    result.durationMs = Date.now() - start;
    this.logger.log(`syncClients: ${result.recordsProcessed} registros em ${result.durationMs}ms`);
    return result;
  }

  async syncProducts(): Promise<SyncResult> {
    const start = Date.now();
    const result: SyncResult = {
      success: true, entity: "products", recordsProcessed: 0,
      recordsUpdated: 0, recordsCreated: 0, errors: [],
      durationMs: 0,
    };

    try {
      let page = 1;
      let hasMore = true;

      const lastSync = await this.cache.get<string>(LAST_SYNC_KEY_PRODUCTS);
      const alteradoDesde = lastSync || "1900-01-01T00:00:00Z";

      while (hasMore) {
        const payload: FlexTotalProdutosRequest = {
          PAGE: String(page),
          PAGE_SIZE: String(this.defaultPageSize),
          ALTERADO_DESDE: alteradoDesde,
        };

        const response = await this.callApi<FlexTotalProdutosResponse>(
          FLEXTOTAL_CONFIG.endpoints.D14_PRODUTOS,
          payload,
        );

        const products = Array.isArray(response) ? response : [];
        result.recordsProcessed += products.length;

        for (const p of products) {
          try {
            const upserted = await this.upsertProduct(p);
            if (upserted) result.recordsCreated++;
            else result.recordsUpdated++;
          } catch (err) {
            result.errors.push(`Produto ${p.sku}: ${(err as Error).message}`);
          }
        }

        const totalRegs = products.length > 0 ? String(products[0].total_registros ?? 0) : "0";
        hasMore = hasMorePages(page, totalRegs, this.defaultPageSize);
        page++;
      }

      await this.cache.set(LAST_SYNC_KEY_PRODUCTS, new Date().toISOString());
      await this.cache.invalidate("products:all");
      await this.cache.invalidate("flextotal:products");
      this.eventEmitter.emit("flextotal.sync.products.complete", { records: result.recordsProcessed });
    } catch (err) {
      result.success = false;
      result.errors.push((err as Error).message);
      this.logger.error("syncProducts failed", (err as Error).message);
    }

    result.durationMs = Date.now() - start;
    this.logger.log(`syncProducts: ${result.recordsProcessed} registros em ${result.durationMs}ms`);
    return result;
  }

  async syncStock(): Promise<SyncResult> {
    const start = Date.now();
    const result: SyncResult = {
      success: true, entity: "stock", recordsProcessed: 0,
      recordsUpdated: 0, recordsCreated: 0, errors: [],
      durationMs: 0,
    };

    try {
      const now = new Date();

      const payload: FlexTotalEstoqueRequest = {
        DT_INI: "01/01/1900 00:00",
        DT_FIM: `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
        CD_ITEM: [],
      };

      const response = await this.callApi<FlexTotalEstoqueResponse>(
        FLEXTOTAL_CONFIG.endpoints.D15_ESTOQUE,
        payload,
      );

      const stockItems = Array.isArray(response) ? response : [];
      result.recordsProcessed = stockItems.length;

      for (const s of stockItems) {
        try {
          const upserted = await this.upsertStock(s);
          if (upserted) result.recordsCreated++;
          else result.recordsUpdated++;
        } catch (err) {
          result.errors.push(`Estoque ${s.cd_item}: ${(err as Error).message}`);
        }
      }

      await this.cache.set(LAST_SYNC_KEY_STOCK, new Date().toISOString());
      await this.cache.invalidate("flextotal:stock");
      this.eventEmitter.emit("flextotal.sync.stock.complete", { records: result.recordsProcessed });
    } catch (err) {
      result.success = false;
      result.errors.push((err as Error).message);
      this.logger.error("syncStock failed", (err as Error).message);
    }

    result.durationMs = Date.now() - start;
    this.logger.log(`syncStock: ${result.recordsProcessed} itens em ${result.durationMs}ms`);
    return result;
  }

  async getTechSheet(sku: string): Promise<string | null> {
    try {
      const payload: FlexTotalFichaTecnicaRequest = { CD_ITEM: sku };
      const response = await this.callApi<FlexTotalFichaTecnicaResponse>(
        FLEXTOTAL_CONFIG.endpoints.D16_FICHA_TECNICA,
        payload,
      );

      const items = Array.isArray(response) ? response : [];
      const html = items[0]?.ficha_tecnica ?? null;

      if (html) {
        await this.prisma.product.updateMany({
          where: { sku, descricao_html: null },
          data: { descricao_html: html },
        });
      }

      return html;
    } catch (err) {
      this.logger.error(`getTechSheet(${sku}) failed`, (err as Error).message);
      return null;
    }
  }

  async syncTechSheets(): Promise<SyncResult> {
    const start = Date.now();
    const result: SyncResult = {
      success: true, entity: "tech-sheets", recordsProcessed: 0,
      recordsUpdated: 0, recordsCreated: 0, errors: [],
      durationMs: 0,
    };

    try {
      const semDescricao = await this.prisma.product.findMany({
        where: { descricao_html: null, ativo: true },
        take: 100,
        orderBy: { criado_em: "desc" },
      });

      result.recordsProcessed = semDescricao.length;

      for (const p of semDescricao) {
        try {
          const html = await this.getTechSheet(p.sku);
          if (html) result.recordsUpdated++;
        } catch (err) {
          result.errors.push(`TechSheet ${p.sku}: ${(err as Error).message}`);
        }
      }

      this.logger.log(`syncTechSheets: ${result.recordsProcessed} processados, ${result.recordsUpdated} atualizados`);
    } catch (err) {
      result.success = false;
      result.errors.push((err as Error).message);
      this.logger.error("syncTechSheets failed", (err as Error).message);
    }

    result.durationMs = Date.now() - start;
    return result;
  }

  async syncAll(): Promise<SyncResult[]> {
    const results = await Promise.allSettled([
      this.syncClients(),
      this.syncProducts(),
      this.syncStock(),
      this.syncTechSheets(),
    ]);

    return results.map((r) =>
      r.status === "fulfilled" ? r.value : { success: false, entity: "unknown", recordsProcessed: 0, recordsUpdated: 0, recordsCreated: 0, errors: [(r.reason as Error).message], durationMs: 0 },
    );
  }

  private async callApi<T>(endpoint: string, payload: unknown): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = buildAuthHeaders();

    this.logger.debug(`POST ${url} page=${(payload as any).PAGE}`);

    const { data } = await firstValueFrom(
      this.httpService.post<T>(url, payload, { headers, timeout: 120000 }),
    );

    this.logger.debug(`RESPONSE ${url}: ${JSON.stringify(data).substring(0, 500)}`);

    return data;
  }

  private async upsertClient(data: FlexTotalClientesItem): Promise<boolean> {
    const uid = `flextotal-${data.id_cliente}`;
    const existing = await this.prisma.user.findUnique({ where: { uid } });

    const userData = {
      uid,
      nome: data.nome_razao_social,
      email: data.email || data.email_nfe || `cliente-${data.id_cliente}@flextotal.local`,
      papel: "cliente",
      status: data.ativo ? "ativo" : "inativo",
      cpf_cnpj: data.cpf_cnpj || null,
      telefone: data.telefone || data.whatsapp || data.celular || null,
      segmento: data.segmento_descricao || null,
      limite_credito: data.limite_credito ?? null,
      ultima_compra: data.ultima_compra ? new Date(data.ultima_compra) : null,
      ativo: data.ativo,
      endereco: JSON.stringify({
        logradouro: data.endereco_logradouro ?? "",
        numero: String(data.endereco_numero ?? ""),
        bairro: data.bairro ?? "",
        cidade: data.cidade ?? "",
        estado: data.uf ?? "",
        cep: data.cep ?? "",
      }),
    };

    if (existing) {
      await this.prisma.user.update({ where: { uid }, data: userData });
      return false;
    }
    await this.prisma.user.create({ data: { ...userData, origem: "ERP FlexTotal" } });
    return true;
  }

  private async upsertProduct(data: FlexTotalProdutosItem): Promise<boolean> {
    const sku = data.sku.toString();
    const existing = await this.prisma.product.findUnique({ where: { sku } });

    const productData = {
      sku,
      nome: data.nome,
      categoria: data.categoria_descricao || null,
      subcategoria: data.subcategoria_descricao || null,
      marca: data.marca_descricao || null,
      descricao_html: data.descricao_html || null,
      imagem_url: data.imagem_url || null,
      preco_tabela: data.preco_tabela ?? null,
      preco_promocional: data.preco_promocional ?? null,
      ncm: data.ncm || null,
      unidade: data.unidade || null,
      controlado_anvisa: data.controlado_anvisa ?? false,
      ativo: data.ativo ?? true,
    };

    if (existing) {
      await this.prisma.product.update({ where: { sku }, data: productData });
      return false;
    }

    await this.prisma.product.create({ data: productData });
    return true;
  }

  private async upsertStock(data: FlexTotalEstoqueItem): Promise<boolean> {
    const sku = data.cd_item;
    const existingProduct = await this.prisma.product.findUnique({ where: { sku } });
    if (!existingProduct) {
      this.logger.warn(`Produto SKU ${sku} não encontrado no banco — ignorando estoque`);
      return false;
    }

    const reservado = data.qt_atual - data.qt_disponivel;

    await this.prisma.stockBatch.upsert({
      where: { sku },
      update: {
        quantidade: data.qt_atual,
        reservado: reservado > 0 ? reservado : 0,
        disponivel: data.qt_disponivel,
        atualizado_em: new Date(),
      },
      create: {
        sku,
        quantidade: data.qt_atual,
        reservado: reservado > 0 ? reservado : 0,
        disponivel: data.qt_disponivel,
      },
    });

    return true;
  }
}