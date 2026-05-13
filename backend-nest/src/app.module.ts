import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { StoresModule } from './stores/stores.module';
import { ServicesModule } from './services/services.module';
import { QuotationsModule } from './quotations/quotations.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { AuditModule } from './audit/audit.module';
import { TosModule } from './tos/tos.module';
import { StorageModule } from './storage/storage.module';
import { TransportModule } from './transport/transport.module';
import { InspectionsModule } from './inspections/inspections.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DocumentsModule } from './documents/documents.module';
import { ReportsModule } from './reports/reports.module';
import { CommissionsModule } from './commissions/commissions.module';
import { SearchModule } from './search/search.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { DriversModule } from './drivers/drivers.module';
import { DriversController } from './drivers/drivers.controller';
import { WarehousesModule } from './warehouses/warehouses.module';
import { StorageLocationsModule } from './storage_locations/storage_locations.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'logistica_tos',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    CatalogsModule,
    StoresModule,
    ServicesModule,
    QuotationsModule,
    OrdersModule,
    PaymentsModule,
    AuditModule,
    TosModule,
    StorageModule,
    TransportModule,
    InspectionsModule,
    ReviewsModule,
    DocumentsModule,
    ReportsModule,
    CommissionsModule,
    SearchModule,
    VehiclesModule,
    DriversModule,
    WarehousesModule,
    StorageLocationsModule,
  ],
  controllers: [AppController, DriversController],
  providers: [AppService],
})
export class AppModule {}

})
export class AppModule {}
