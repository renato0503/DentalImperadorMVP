import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductQueryDto } from "./dto/product-query.dto";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    if (query.categoria) {
      return this.productsService.findByCategory(query.categoria, query.skip, query.take);
    }
    return this.productsService.findAll(query.skip, query.take);
  }

  @Get("categories")
  async getCategories() {
    return this.productsService.getCategories();
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
