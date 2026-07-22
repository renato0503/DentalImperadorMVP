import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { CacheModule } from "./cache/cache.module";
import { PrismaModule } from "./prisma/prisma.module";
import { FirebaseModule } from "./firebase/firebase.module";
import { ProductsModule } from "./products/products.module";
import { OrdersModule } from "./orders/orders.module";
import { CustomersModule } from "./customers/customers.module";
import { ChurnModule } from "./churn/churn.module";
import { WarehouseModule } from "./warehouse/warehouse.module";
import { ReportsModule } from "./reports/reports.module";
import { HealthModule } from "./health/health.module";
import { AdminModule } from "./admin/admin.module";
import { CrmModule } from "./crm/crm.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { ApiKeyModule } from "./api-key/api-key.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    EventEmitterModule.forRoot(),
    CacheModule,
    PrismaModule,
    FirebaseModule,
    ProductsModule,
    OrdersModule,
    CustomersModule,
    ChurnModule,
    WarehouseModule,
    ReportsModule,
    HealthModule,
    AdminModule,
    ApiKeyModule,
    CrmModule,
    NotificationsModule,
  ],
})
export class AppModule {}
