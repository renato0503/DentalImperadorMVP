import { Controller, Get, Post, Param } from "@nestjs/common";
import { FlexTotalService } from "./flextotal.service";
import type { SyncResult } from "./flextotal.types";

@Controller("flextotal")
export class FlexTotalController {
  constructor(private readonly flextotal: FlexTotalService) {}

  @Post("sync/clients")
  async syncClients(): Promise<SyncResult> {
    return this.flextotal.syncClients();
  }

  @Post("sync/products")
  async syncProducts(): Promise<SyncResult> {
    return this.flextotal.syncProducts();
  }

  @Post("sync/stock")
  async syncStock(): Promise<SyncResult> {
    return this.flextotal.syncStock();
  }

  @Post("sync/tech-sheets")
  async syncTechSheets(): Promise<SyncResult> {
    return this.flextotal.syncTechSheets();
  }

  @Post("sync/all")
  async syncAll(): Promise<SyncResult[]> {
    return this.flextotal.syncAll();
  }

  @Get("tech-sheet/:sku")
  async techSheet(@Param("sku") sku: string): Promise<string | null> {
    return this.flextotal.getTechSheet(sku);
  }
}
