import { Controller, Get, Patch, Param, Body, Query } from "@nestjs/common";
import { AdminService, type AdminMetrics, type AdminUser, type ActivityItem, type SyncStatus } from "./admin.service";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("metrics")
  async getMetrics(): Promise<AdminMetrics> {
    return this.adminService.getMetrics();
  }

  @Get("users")
  async getUsers(): Promise<AdminUser[]> {
    return this.adminService.getUsers();
  }

  @Patch("users/:uid/role")
  async updateUserRole(
    @Param("uid") uid: string,
    @Body("role") role: string
  ): Promise<AdminUser> {
    return this.adminService.updateUserRole(uid, role);
  }

  @Get("activity")
  async getActivity(@Query("limit") limit?: string): Promise<ActivityItem[]> {
    return this.adminService.getActivity(limit ? +limit : 10);
  }

  @Get("sync-status")
  async getSyncStatus(): Promise<SyncStatus> {
    return this.adminService.getSyncStatus();
  }

  @Get("sales-history")
  async getSalesHistory() {
    return this.adminService.getSalesHistory();
  }

  @Get("segment-stats")
  async getSegmentStats() {
    return this.adminService.getSegmentStats();
  }

  @Get("vendors")
  async getVendors() {
    return this.adminService.getVendors();
  }
}
