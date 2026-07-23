import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CacheService } from "../cache/cache.service";

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService
  ) {}

  async findAll() {
    const cached = await this.cache.get<any[]>("products:all");
    if (cached) return cached;

    const data = await this.prisma.product.findMany({
      orderBy: { nome: "asc" },
    });
    await this.cache.set("products:all", data, 1800);
    return data;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    return product;
  }

  async findBySku(sku: string) {
    const product = await this.prisma.product.findUnique({
      where: { sku },
    });
    if (!product) {
      throw new NotFoundException(`Produto SKU ${sku} não encontrado`);
    }
    return product;
  }

  async findByCategory(category: string) {
    return this.prisma.product.findMany({
      where: {
        categoria: { contains: category },
      },
      orderBy: { nome: "asc" },
    });
  }
}
