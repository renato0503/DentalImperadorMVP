import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:5173",
      "https://dentalimperador.web.app",
      "https://dentalimperador-d2529.firebaseapp.com",
      "https://dentalimperador-backend-330816807481.us-central1.run.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });

  const config = new DocumentBuilder()
    .setTitle("Dental Imperador API")
    .setDescription("API pública B2B para integração com sistemas parceiros. Recursos: produtos, pedidos, clientes, relatórios e métricas.")
    .setVersion("1.0.0")
    .setContact("Dental Imperador", "https://dentalimperador.web.app", "vendas@dentalimperador.com.br")
    .addServer("https://api.dentalimperador.com.br", "Produção")
    .addServer("http://localhost:3001", "Desenvolvimento")
    .addApiKey({ type: "apiKey", name: "x-api-key", in: "header", description: "Chave de API fornecida pela Dental Imperador" }, "api-key")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    customSiteTitle: "Dental Imperador — API Docs",
    customCss: ".swagger-ui .topbar { display: none }",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.setGlobalPrefix("api/v1");

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Backend rodando em http://localhost:${port}`);
  logger.log(`API Docs em http://localhost:${port}/api/docs`);
}
bootstrap().catch((err) => {
  const logger = new Logger("Bootstrap");
  logger.error("Falha ao iniciar backend");
  logger.error(err.message);
  logger.error(err.stack);
  process.exit(1);
});
