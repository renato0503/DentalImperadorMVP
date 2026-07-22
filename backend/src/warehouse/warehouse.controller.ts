import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { WarehouseService, type PickRequest } from "./warehouse.service";

@Controller("warehouse")
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get("picks")
  async getPicks(@Query("status") status?: string): Promise<PickRequest[]> {
    return this.warehouseService.getPicks(status);
  }

  @Get("picks/:id")
  async getPick(@Param("id") id: string): Promise<PickRequest> {
    return this.warehouseService.getPick(id);
  }

  @Get("events")
  async getEvents() {
    return this.warehouseService.getEvents();
  }

  @Post("pick")
  async createPick(
    @Body()
    data: {
      pedido_numero: string;
      sku: string;
      produto: string;
      quantidade: number;
      local_estoque?: string;
    }
  ): Promise<PickRequest> {
    return this.warehouseService.createPick(data);
  }

  @Post("picks/:id/complete")
  async completePick(
    @Param("id") id: string,
    @Body() data: { quantidade: number; observacao?: string }
  ): Promise<PickRequest> {
    return this.warehouseService.completePick(id, data.quantidade, data.observacao);
  }
}
