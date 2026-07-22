import { Controller, Get } from "@nestjs/common";
import { CacheService } from "../cache/cache.service";

@Controller()
export class HealthController {
  constructor(private cache: CacheService) {}

  @Get("health")
  health() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get("cache/stats")
  cacheStats() {
    return this.cache.stats;
  }
}
