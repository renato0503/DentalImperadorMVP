import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FlexTotalService } from "./flextotal.service";
import { FLEXTOTAL_CONFIG } from "./flextotal.config";

@Injectable()
export class FlexTotalScheduler {
  private readonly logger = new Logger(FlexTotalScheduler.name);

  constructor(private readonly flextotal: FlexTotalService) {}

  @Cron(CronExpression.EVERY_30_MINUTES, { name: "flextotal_sync" })
  async handleSync() {
    if (!FLEXTOTAL_CONFIG.sync.enabled) {
      this.logger.log("Sync automático desabilitado via FLEXTOTAL_SYNC_ENABLED");
      return;
    }

    this.logger.log("Iniciando sincronização automática com FlexTotal ERP...");
    const results = await this.flextotal.syncAll();

    for (const r of results) {
      if (r.success) {
        this.logger.log(`[${r.entity}] OK — ${r.recordsProcessed} registros (${r.durationMs}ms)`);
      } else {
        this.logger.error(`[${r.entity}] FALHA — ${r.errors.join("; ")}`);
      }
    }
  }
}
