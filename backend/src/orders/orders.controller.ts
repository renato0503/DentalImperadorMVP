import { Controller, Get, Param, Query } from "@nestjs/common";
import { OrdersService, type Order } from "./orders.service";
import { OrderQueryDto } from "./dto/order-query.dto";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query() query: OrderQueryDto): Promise<Order[]> {
    return this.ordersService.findAll(query.cliente_uid);
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
