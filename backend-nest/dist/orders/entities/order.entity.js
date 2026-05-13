"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const store_entity_1 = require("../../stores/entities/store.entity");
const service_entity_1 = require("../../services/entities/service.entity");
const quotation_entity_1 = require("../../quotations/entities/quotation.entity");
const master_catalog_item_entity_1 = require("../../catalogs/entities/master-catalog-item.entity");
let Order = class Order {
    id;
    orderCode;
    quotation;
    client;
    store;
    service;
    subtotalAmount;
    taxAmount;
    commissionAmount;
    totalAmount;
    providerNetAmount;
    currency;
    operationalStatus;
    financialStatus;
    documentStatus;
    startedAt;
    closedAt;
    cancelledAt;
    createdAt;
    updatedAt;
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "orderCode", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => quotation_entity_1.Quotation),
    (0, typeorm_1.JoinColumn)({ name: 'quotation_id' }),
    __metadata("design:type", quotation_entity_1.Quotation)
], Order.prototype, "quotation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], Order.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_entity_1.Service),
    (0, typeorm_1.JoinColumn)({ name: 'service_id' }),
    __metadata("design:type", service_entity_1.Service)
], Order.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "subtotalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "commissionAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "providerNetAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => master_catalog_item_entity_1.MasterCatalogItem),
    (0, typeorm_1.JoinColumn)({ name: 'currency_code_id' }),
    __metadata("design:type", master_catalog_item_entity_1.MasterCatalogItem)
], Order.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: 'CREATED',
    }),
    __metadata("design:type", String)
], Order.prototype, "operationalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: 'UNPAID',
    }),
    __metadata("design:type", String)
], Order.prototype, "financialStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: 'PENDING',
    }),
    __metadata("design:type", String)
], Order.prototype, "documentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "closedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map