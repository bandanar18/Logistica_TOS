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
exports.MasterCatalog = void 0;
const typeorm_1 = require("typeorm");
const master_catalog_item_entity_1 = require("./master-catalog-item.entity");
let MasterCatalog = class MasterCatalog {
    id;
    code;
    name;
    description;
    status;
    items;
    createdAt;
    updatedAt;
};
exports.MasterCatalog = MasterCatalog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MasterCatalog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], MasterCatalog.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MasterCatalog.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MasterCatalog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], MasterCatalog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => master_catalog_item_entity_1.MasterCatalogItem, item => item.catalog),
    __metadata("design:type", Array)
], MasterCatalog.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MasterCatalog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MasterCatalog.prototype, "updatedAt", void 0);
exports.MasterCatalog = MasterCatalog = __decorate([
    (0, typeorm_1.Entity)('master_catalogs')
], MasterCatalog);
//# sourceMappingURL=master-catalog.entity.js.map