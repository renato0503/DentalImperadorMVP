import { Module } from "@nestjs/common";
import { WarehouseController } from "./warehouse.controller";
import { WarehouseService } from "./warehouse.service";
import { PickingConsumer } from "./picking-consumer";

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService, PickingConsumer],
})
export class WarehouseModule {}
