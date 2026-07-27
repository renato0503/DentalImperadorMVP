import { Module } from "@nestjs/common";
import { GestaoController } from "./gestao.controller";

@Module({
  controllers: [GestaoController],
})
export class GestaoModule {}
