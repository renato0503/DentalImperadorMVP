import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { PrismaService } from "../prisma/prisma.service";
import { CacheService } from "../cache/cache.service";

describe("ProductsService", () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn().mockResolvedValue([
                { id: "1", sku: "RS001", nome: "Resina", categoria: "Restauradores", preco_tabela: 89.9 },
              ]),
              findUnique: jest.fn().mockResolvedValue(null),
            },
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all products", async () => {
    const products = await service.findAll();
    expect(products).toHaveLength(1);
    expect(products[0].sku).toBe("RS001");
  });

  it("should throw on missing product", async () => {
    await expect(service.findOne("999")).rejects.toThrow();
  });
});
