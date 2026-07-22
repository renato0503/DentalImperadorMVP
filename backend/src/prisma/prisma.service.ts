import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
      console.log("Prisma conectado ao PostgreSQL");
    } catch (error) {
      console.warn("⚠ Prisma não conectou (PostgreSQL indisponível?):", (error as Error).message);
      console.warn("  O servidor iniciará sem banco de dados. Configure DATABASE_URL no .env");
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
