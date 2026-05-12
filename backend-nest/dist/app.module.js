"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const roles_module_1 = require("./roles/roles.module");
const permissions_module_1 = require("./permissions/permissions.module");
const catalogs_module_1 = require("./catalogs/catalogs.module");
const stores_module_1 = require("./stores/stores.module");
const services_module_1 = require("./services/services.module");
const quotations_module_1 = require("./quotations/quotations.module");
const orders_module_1 = require("./orders/orders.module");
const payments_module_1 = require("./payments/payments.module");
const audit_module_1 = require("./audit/audit.module");
const tos_module_1 = require("./tos/tos.module");
const storage_module_1 = require("./storage/storage.module");
const transport_module_1 = require("./transport/transport.module");
const inspections_module_1 = require("./inspections/inspections.module");
const reviews_module_1 = require("./reviews/reviews.module");
const documents_module_1 = require("./documents/documents.module");
const reports_module_1 = require("./reports/reports.module");
const commissions_module_1 = require("./commissions/commissions.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT || 3306),
                username: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || 'root',
                database: process.env.DB_NAME || 'logistica_tos',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            catalogs_module_1.CatalogsModule,
            stores_module_1.StoresModule,
            services_module_1.ServicesModule,
            quotations_module_1.QuotationsModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            audit_module_1.AuditModule,
            tos_module_1.TosModule,
            storage_module_1.StorageModule,
            transport_module_1.TransportModule,
            inspections_module_1.InspectionsModule,
            reviews_module_1.ReviewsModule,
            documents_module_1.DocumentsModule,
            reports_module_1.ReportsModule,
            commissions_module_1.CommissionsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map