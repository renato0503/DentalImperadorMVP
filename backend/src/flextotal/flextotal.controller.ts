import { Controller, Get, Post, Param, NotFoundException } from "@nestjs/common";
import { FlexTotalService, SyncLogEntry } from "./flextotal.service";

@Controller("flextotal")
export class FlexTotalController {
  constructor(private readonly flextotal: FlexTotalService) {}

  @Post("sync/clients")
  async syncClients(): Promise<{ syncId: string }> {
    const syncId = await this.flextotal.startSync("clients");
    return { syncId };
  }

  @Post("sync/products")
  async syncProducts(): Promise<{ syncId: string }> {
    const syncId = await this.flextotal.startSync("products");
    return { syncId };
  }

  @Post("sync/stock")
  async syncStock(): Promise<{ syncId: string }> {
    const syncId = await this.flextotal.startSync("stock");
    return { syncId };
  }

  @Post("sync/tech-sheets")
  async syncTechSheets(): Promise<{ syncId: string }> {
    const syncId = await this.flextotal.startSync("tech-sheets");
    return { syncId };
  }

  @Post("sync/all")
  async syncAll(): Promise<{ syncId: string }> {
    const syncId = await this.flextotal.startSync("all");
    return { syncId };
  }

  @Get("sync/status/:id")
  async getSyncStatus(@Param("id") id: string): Promise<SyncLogEntry> {
    const status = await this.flextotal.getSyncStatus(id);
    if (!status) throw new NotFoundException(`Sync ${id} não encontrado`);
    return status;
  }

  @Get("sync/last/:entity")
  async getLastSyncStatus(@Param("entity") entity: string): Promise<SyncLogEntry> {
    const status = await this.flextotal.getLastSyncStatus(entity);
    if (!status) throw new NotFoundException(`Nenhum sync encontrado para ${entity}`);
    return status;
  }

  @Get("tech-sheet/:sku")
  async techSheet(@Param("sku") sku: string): Promise<string | null> {
    return this.flextotal.getTechSheet(sku);
  }
}