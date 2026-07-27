import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { FlexTotalController } from "./flextotal.controller";
import { FlexTotalService } from "./flextotal.service";
import { FlexTotalScheduler } from "./flextotal.scheduler";

@Module({
  imports: [
    HttpModule.register({ timeout: 30000 }),
    ScheduleModule.forRoot(),
  ],
  controllers: [FlexTotalController],
  providers: [FlexTotalService, FlexTotalScheduler],
  exports: [FlexTotalService],
})
export class FlexTotalModule {}
