import { Controller, Get, Post, Param, Body, Query } from "@nestjs/common";
import { ChurnService, type ChurnRisk, type Campaign } from "./churn.service";

@Controller("churn")
export class ChurnController {
  constructor(private readonly churnService: ChurnService) {}

  @Get("risks")
  async getRisks(@Query("segmento") segmento?: string): Promise<ChurnRisk[]> {
    return this.churnService.getChurnRisks(segmento);
  }

  @Get("summary")
  async getSummary() {
    return this.churnService.getChurnSummary();
  }

  @Get("campaigns")
  async getCampaigns(): Promise<Campaign[]> {
    return this.churnService.getCampaigns();
  }

  @Post("campaigns")
  async createCampaign(@Body() data: Partial<Campaign>): Promise<Campaign> {
    return this.churnService.createCampaign(data);
  }

  @Post("trigger/:id")
  async triggerCampaign(@Param("id") id: string): Promise<Campaign> {
    return this.churnService.triggerCampaign(id);
  }
}
