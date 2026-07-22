import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from "@nestjs/common";
import { CustomersService, type Customer } from "./customers.service";

@Controller("customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(
    @Query("status") status?: string,
    @Query("segmento") segmento?: string
  ): Promise<Customer[]> {
    return this.customersService.findAll(status, segmento);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<Customer>): Promise<Customer> {
    return this.customersService.create(data);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() data: Partial<Customer>
  ): Promise<Customer> {
    return this.customersService.update(id, data);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    return this.customersService.remove(id);
  }
}
