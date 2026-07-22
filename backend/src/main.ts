import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:5173",
      "https://dentalimperador.web.app",
      "https://dentalimperador-d2529.firebaseapp.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });

  app.setGlobalPrefix("api/v1");

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend rodando em http://localhost:${port}`);
}
bootstrap();
