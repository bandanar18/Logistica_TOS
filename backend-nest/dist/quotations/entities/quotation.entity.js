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
exports.Quotation = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const store_entity_1 = require("../../stores/entities/store.entity");
const service_entity_1 = require("../../services/entities/service.entity");
const master_catalog_item_entity_1 = require("../../catalogs/entities/master-catalog-item.entity");
let Quotation = class Quotation {
    id;
    quotationCode;
    client;
    store;
    service;
    quantity;
    unitMeasure;
    subtotalAmount;
    taxAmount;
    commissionAmount;
    totalAmount;
    currency;
    notes;
    responseNotes;
    status;
    respondedAt;
    approvedAt;
    rejectedAt;
    expiresAt;
    createdAt;
    updatedAt;
};
exports.Quotation = Quotation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Quotation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "quotationCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", user_entity_1.User)
], Quotation.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], Quotation.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_entity_1.Service),
    (0, typeorm_1.JoinColumn)({ name: 'service_id' }),
    __metadata("design:type", service_entity_1.Service)
], Quotation.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Quotation.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => master_catalog_item_entity_1.MasterCatalogItem),
    (0, typeorm_1.JoinColumn)({ name: 'unit_measure_id' }),
    __metadata("design:type", master_catalog_item_entity_1.MasterCatalogItem)
], Quotation.prototype, "unitMeasure", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Quotation.prototype, "subtotalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Quotation.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Quotation.prototype, "commissionAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Quotation.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => master_catalog_item_entity_1.MasterCatalogItem),
    (0, typeorm_1.JoinColumn)({ name: 'currency_code_id' }),
    __metadata("design:type", master_catalog_item_entity_1.MasterCatalogItem)
], Quotation.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "responseNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: 'REQUESTED',
    }),
    __metadata("design:type", String)
], Quotation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Quotation.prototype, "respondedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Quotation.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Quotation.prototype, "rejectedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Quotation.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Quotation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Quotation.prototype, "updatedAt", void 0);
exports.Quotation = Quotation = __decorate([
    (0, typeorm_1.Entity)('quotations')
], Quotation);
//# sourceMappingURL=quotation.entity.js.map