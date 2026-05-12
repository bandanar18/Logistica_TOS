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
exports.MasterCatalogItem = void 0;
const typeorm_1 = require("typeorm");
const master_catalog_entity_1 = require("./master-catalog.entity");
let MasterCatalogItem = class MasterCatalogItem {
    id;
    code;
    name;
    description;
    status;
    catalog;
    createdAt;
    updatedAt;
};
exports.MasterCatalogItem = MasterCatalogItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MasterCatalogItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MasterCatalogItem.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MasterCatalogItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MasterCatalogItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], MasterCatalogItem.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => master_catalog_entity_1.MasterCatalog, catalog => catalog.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'catalog_id' }),
    __metadata("design:type", master_catalog_entity_1.MasterCatalog)
], MasterCatalogItem.prototype, "catalog", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MasterCatalogItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MasterCatalogItem.prototype, "updatedAt", void 0);
exports.MasterCatalogItem = MasterCatalogItem = __decorate([
    (0, typeorm_1.Entity)('master_catalog_items')
], MasterCatalogItem);
//# sourceMappingURL=master-catalog-item.entity.js.map