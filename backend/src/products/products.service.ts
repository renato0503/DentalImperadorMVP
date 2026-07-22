import { Injectable } from "@nestjs/common";
import { CacheService } from "../cache/cache.service";

const MOCK_PRODUCTS = [
  {
    id: "1",
    sku: "RS001",
    nome: "Resina Composta Z350 XT - 4g",
    categoria: "Restauradores",
    preco_tabela: 89.9,
    ncm: "3006.40.00",
    controlado_anvisa: false,
  },
  {
    id: "2",
    sku: "ALG01",
    nome: "Alginato CAVEX - Pote 500g",
    categoria: "Moldagem",
    preco_tabela: 42.5,
    ncm: "3824.99",
    controlado_anvisa: false,
  },
  {
    id: "3",
    sku: "ADP01",
    nome: "Adesivo Ambar Universal 5ml",
    categoria: "Adesivos",
    preco_tabela: 129.0,
    ncm: "3506.91",
    controlado_anvisa: false,
  },
  {
    id: "4",
    sku: "ANES01",
    nome: "Anestésico Lidocaína 2% - 1,8ml (cx 50)",
    categoria: "Anestésicos",
    preco_tabela: 189.0,
    ncm: "3004.90",
    controlado_anvisa: true,
  },
];

@Injectable()
export class ProductsService {
  constructor(private cache: CacheService) {}

  async findAll() {
    const cached = await this.cache.get<typeof MOCK_PRODUCTS>("products:all");
    if (cached) return cached;

    const data = MOCK_PRODUCTS;
    await this.cache.set("products:all", data, 1800);
    return data;
  }

  async findOne(id: string) {
    return MOCK_PRODUCTS.find((p) => p.id === id) || null;
  }

  async findBySku(sku: string) {
    return MOCK_PRODUCTS.find((p) => p.sku === sku) || null;
  }

  async findByCategory(category: string) {
    return MOCK_PRODUCTS.filter(
      (p) => p.categoria.toLowerCase() === category.toLowerCase()
    );
  }
}
