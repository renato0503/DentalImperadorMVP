import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import type { PickingEvent } from "./warehouse.service";

@Injectable()
export class PickingConsumer {
  private readonly logger = new Logger(PickingConsumer.name);

  @OnEvent("picking.start")
  handlePickStart(event: PickingEvent) {
    this.logger.log(
      `[Consumer] Pick iniciado: #${event.pedidoNumero} — ${event.pickId}`
    );
  }

  @OnEvent("picking.done")
  handlePickDone(event: PickingEvent) {
    this.logger.log(
      `[Consumer] Pick concluído: #${event.pedidoNumero} — ${event.pickId}`
    );
  }

  @OnEvent("picking.error")
  handlePickError(event: PickingEvent) {
    this.logger.warn(
      `[Consumer] Pick com ressalvas: #${event.pedidoNumero} — ${event.pickId}`
    );
  }
}
