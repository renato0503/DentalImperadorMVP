import { Controller, Post, Body } from "@nestjs/common";
import { Public } from "../api-key/api-key.guard";
import { ChatService } from "./chat.service";

@Controller("chat")
@Public()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@Body("mensagem") mensagem: string, @Body("contexto") contexto?: string) {
    const resposta = await this.chatService.sendMessage(mensagem, contexto);
    return { resposta };
  }
}
