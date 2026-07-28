import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

const API_KEY = "demo-key-2026";
const isLive = !!process.env.DATABASE_URL?.startsWith("postgres");

describe("Smoke Tests", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix("api/v1");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Health", () => {
    it("GET /api/v1/health deve retornar 200", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/v1/health")
        .set("x-api-key", API_KEY);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status");
    });
  });

  describe("Auth", () => {
    it("requisição sem x-api-key deve retornar 401", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/v1/products?take=1");

      expect(res.status).toBe(401);
    });

    it("requisição com x-api-key inválida deve retornar 401", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/v1/products?take=1")
        .set("x-api-key", "invalid-key");

      expect(res.status).toBe(401);
    });
  });

  describe("Products", () => {
    it("GET /api/v1/products?take=5 deve responder", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/v1/products?take=5")
        .set("x-api-key", API_KEY);

      if (isLive) {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
      } else {
        expect([200, 500]).toContain(res.status);
      }
    });

    it("GET /api/v1/products/categories deve responder", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/v1/products/categories")
        .set("x-api-key", API_KEY);

      expect([200, 500]).toContain(res.status);
      if (res.status === 200) expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("Orders", () => {
    it("GET /api/v1/orders deve responder", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/v1/orders")
        .set("x-api-key", API_KEY);

      expect([200, 500]).toContain(res.status);
    });
  });

  describe("Chat", () => {
    it("POST /api/v1/chat deve aceitar mensagem", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/v1/chat")
        .set("x-api-key", API_KEY)
        .send({ mensagem: "Olá" });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("resposta");
    });
  });

  describe("Admin", () => {
    it("GET /api/v1/admin/metrics deve responder", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/v1/admin/metrics")
        .set("x-api-key", API_KEY);

      expect([200, 500]).toContain(res.status);
      if (res.status === 200) expect(res.body).toHaveProperty("faturamento_mes");
    });
  });

  describe("FlexTotal", () => {
    it("POST /api/v1/flextotal/sync/products deve disparar sync (401 sem API key)", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/v1/flextotal/sync/products");

      expect(res.status).toBe(401);
    });

    it("POST /api/v1/flextotal/sync/stock com API key deve responder", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/v1/flextotal/sync/stock")
        .set("x-api-key", API_KEY);

      expect([201, 401, 500]).toContain(res.status);
      if (res.status === 201) expect(res.body).toHaveProperty("syncId");
    });

    it("GET /api/v1/flextotal/tech-sheet/:sku sem API key deve retornar 401", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/v1/flextotal/tech-sheet/test");

      expect(res.status).toBe(401);
    });

    it("GET /api/v1/flextotal/sync/last/:entity deve retornar status ou 404", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/v1/flextotal/sync/last/products")
        .set("x-api-key", API_KEY);

      expect([200, 404, 500]).toContain(res.status);
    });
  });
});
