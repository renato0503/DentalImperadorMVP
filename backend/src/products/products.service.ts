import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CacheService } from "../cache/cache.service";

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService
  ) {}

  async findAll(skip = 0, take = 100) {
    const cacheKey = `products:all:${skip}:${take}`;
    const cached = await this.cache.get<any[]>(cacheKey);
    if (cached) return cached;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
        orderBy: { nome: "asc" },
      }),
      this.prisma.product.count(),
    ]);

    await this.cache.set(cacheKey, { data, total, skip, take }, 1800);
    return { data, total, skip, take };
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

  async getCategories() {
    const cached = await this.cache.get<string[]>("products:categories");
    if (cached) return cached;

    const result = await this.prisma.product.findMany({
      where: { categoria: { not: null }, ativo: true },
      select: { categoria: true },
      distinct: ["categoria"],
      orderBy: { categoria: "asc" },
    });

    const categories = result.map((r) => r.categoria).filter(Boolean) as string[];
    await this.cache.set("products:categories", categories, 3600);
    return categories;
  }

  async findByCategory(category: string, skip = 0, take = 100) {
    const where = { categoria: { contains: category } };
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { nome: "asc" },
      }),
      this.prisma.product.count({ where }),
    ]);
    return { data, total, skip, take };
  }
}
