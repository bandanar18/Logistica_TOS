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
exports.Warehouse = void 0;
const typeorm_1 = require("typeorm");
const store_entity_1 = require("../../stores/entities/store.entity");
let Warehouse = class Warehouse {
    id;
    warehouseCode;
    warehouseName;
    store;
    warehouseType;
    address;
    capacityUnits;
    status;
    createdAt;
    updatedAt;
};
exports.Warehouse = Warehouse;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Warehouse.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Warehouse.prototype, "warehouseCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Warehouse.prototype, "warehouseName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store),
    __metadata("design:type", store_entity_1.Store)
], Warehouse.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Warehouse.prototype, "warehouseType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Warehouse.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Warehouse.prototype, "capacityUnits", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ACTIVE' }),
    __metadata("design:type", String)
], Warehouse.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Warehouse.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Warehouse.prototype, "updatedAt", void 0);
exports.Warehouse = Warehouse = __decorate([
    (0, typeorm_1.Entity)('warehouses')
], Warehouse);
//# sourceMappingURL=warehouse.entity.js.map