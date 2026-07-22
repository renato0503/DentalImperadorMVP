import { Controller, Get, Query, StreamableFile, Header } from "@nestjs/common";
import { ReportsService, type SalesByPeriod, type SalesByCategory, type TopProduct, type SalesSummary } from "./reports.service";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("summary")
  async getSummary(): Promise<SalesSummary> {
    return this.reportsService.getSummary();
  }

  @Get("sales")
  async getSalesByPeriod(
    @Query("inicio") inicio?: string,
    @Query("fim") fim?: string
  ): Promise<SalesByPeriod[]> {
    return this.reportsService.getSalesByPeriod(inicio, fim);
  }

  @Get("categories")
  async getSalesByCategory(): Promise<SalesByCategory[]> {
    return this.reportsService.getSalesByCategory();
  }

  @Get("top-products")
  async getTopProducts(@Query("limit") limit?: string): Promise<TopProduct[]> {
    return this.reportsService.getTopProducts(limit ? +limit : 10);
  }

  @Get("export/csv")
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Content-Disposition", "attachment; filename=\"relatorio.csv\"")
  async exportCSV(
    @Query("tipo") tipo: "vendas" | "categorias" | "produtos",
    @Query("inicio") inicio?: string,
    @Query("fim") fim?: string,
  ): Promise<string> {
    const csv = await this.reportsService.exportCSV(tipo, inicio, fim);
    return "\uFEFF" + csv;
  }
}
