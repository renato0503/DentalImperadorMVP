import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query("categoria") categoria?: string) {
    if (categoria) {
      return this.productsService.findByCategory(categoria);
    }
    return this.productsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Get("sku/:sku")
  async findBySku(@Param("sku") sku: string) {
    return this.productsService.findBySku(sku);
  }
}
