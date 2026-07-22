import { Controller, Get, Post, Param, Body, Query } from "@nestjs/common";
import { CrmService, type ClusterDistribution, type SalesAlert, type TimelineEvent, type CustomerDetail } from "./crm.service";

@Controller("crm")
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get("clusters")
  async getClusters(): Promise<{ ticket: ClusterDistribution[]; frequencia: ClusterDistribution[]; segmento: ClusterDistribution[] }> {
    return this.crmService.getClusters();
  }

  @Get("sales-alerts")
  async getSalesAlerts(): Promise<SalesAlert[]> {
    return this.crmService.getSalesAlerts();
  }

  @Get("customers/:id")
  async getCustomer(@Param("id") id: string): Promise<CustomerDetail | null> {
    return this.crmService.getCustomerById(id);
  }

  @Get("customers/:id/timeline")
  async getTimeline(@Param("id") id: string): Promise<TimelineEvent[]> {
    return this.crmService.getTimeline(id);
  }

  @Get("customers/:id/orders")
  async getOrders(@Param("id") id: string): Promise<any[]> {
    return this.crmService.getCustomerOrders(id);
  }

  @Get("customers/:id/estimates")
  async getEstimates(@Param("id") id: string): Promise<any[]> {
    return this.crmService.getCustomerEstimates(id);
  }

  @Post("customers/:id/note")
  async addNote(@Param("id") id: string, @Body("texto") texto: string, @Body("autor") autor: string): Promise<TimelineEvent> {
    return this.crmService.addNote(id, texto, autor);
  }

  @Post("customers/:id/assign")
  async assignVendor(@Param("id") id: string, @Body("vendedor_uid") vendedorUid: string, @Body("vendedor_nome") vendedorNome: string): Promise<CustomerDetail | null> {
    return this.crmService.assignVendor(id, vendedorUid, vendedorNome);
  }
}
