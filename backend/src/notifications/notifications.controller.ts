import { Controller, Get, Patch, Param, Query } from "@nestjs/common";
import { NotificationsService, type Notification } from "./notifications.service";
import { Public } from "../api-key/api-key.guard";

@Controller("notifications")
@Public()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Query("secao") secao?: string): Promise<Notification[]> {
    return this.notificationsService.findAll(secao);
  }

  @Get("unread-count")
  async getUnreadCount(@Query("secao") secao?: string) {
    return this.notificationsService.getUnreadCount(secao);
  }

  @Patch(":id/read")
  async markAsRead(@Param("id") id: string): Promise<Notification | null> {
    return this.notificationsService.markAsRead(id);
  }

  @Patch("read-all")
  async markAllAsRead(): Promise<void> {
    return this.notificationsService.markAllAsRead();
  }
}
