"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("../orders/entities/order.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const quotation_entity_1 = require("../quotations/entities/quotation.entity");
const store_entity_1 = require("../stores/entities/store.entity");
const user_entity_1 = require("../users/entities/user.entity");
const trip_entity_1 = require("../transport/entities/trip.entity");
const inventory_item_entity_1 = require("../storage/entities/inventory-item.entity");
const commission_entity_1 = require("../commissions/entities/commission.entity");
const commission_rule_entity_1 = require("../commission_rules/entities/commission_rule.entity");
const reports_controller_1 = require("./reports.controller");
const reports_service_1 = require("./reports.service");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                store_entity_1.Store,
                quotation_entity_1.Quotation,
                order_entity_1.Order,
                payment_entity_1.Payment,
                trip_entity_1.Trip,
                inventory_item_entity_1.InventoryItem,
                commission_entity_1.Commission,
                commission_rule_entity_1.CommissionRule
            ])
        ],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map