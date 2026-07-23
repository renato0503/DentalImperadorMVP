import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from "@nestjs/common";
import { CustomersService, type Customer } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

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
  async create(@Body() dto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(dto);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCustomerDto
  ): Promise<Customer> {
    return this.customersService.update(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    return this.customersService.remove(id);
  }
}
