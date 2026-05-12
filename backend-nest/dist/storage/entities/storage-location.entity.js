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
exports.StorageLocation = void 0;
const typeorm_1 = require("typeorm");
const warehouse_entity_1 = require("./warehouse.entity");
let StorageLocation = class StorageLocation {
    id;
    warehouse;
    aisle;
    shelf;
    level;
    status;
};
exports.StorageLocation = StorageLocation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StorageLocation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], StorageLocation.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StorageLocation.prototype, "aisle", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StorageLocation.prototype, "shelf", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StorageLocation.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'empty' }),
    __metadata("design:type", String)
], StorageLocation.prototype, "status", void 0);
exports.StorageLocation = StorageLocation = __decorate([
    (0, typeorm_1.Entity)('storage_locations')
], StorageLocation);
//# sourceMappingURL=storage-location.entity.js.map