import { Controller, Get, Param, Query } from "@nestjs/common";
import { OrdersService, type Order } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query("cliente_uid") cliente_uid?: string): Promise<Order[]> {
    return this.ordersService.findAll(cliente_uid);
  }

  @Get("status-flow")
  async getStatusFlow(): Promise<string[]> {
    return this.ordersService.getStatusFlow();
  }

  @Get(":numero")
  async findByNumero(@Param("numero") numero: string): Promise<Order> {
    return this.ordersService.findByNumero(numero);
  }
}
