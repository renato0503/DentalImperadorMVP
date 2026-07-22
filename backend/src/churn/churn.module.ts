import { Module } from "@nestjs/common";
import { ChurnController } from "./churn.controller";
import { ChurnService } from "./churn.service";

@Module({
  controllers: [ChurnController],
  providers: [ChurnService],
})
export class ChurnModule {}
