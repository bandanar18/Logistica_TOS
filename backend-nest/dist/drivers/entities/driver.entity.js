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
exports.Driver = void 0;
const typeorm_1 = require("typeorm");
const store_entity_1 = require("../../stores/entities/store.entity");
let Driver = class Driver {
    id;
    driverCode;
    store;
    firstName;
    lastName;
    phone;
    licenseNumber;
    licenseExpiration;
    status;
    createdAt;
    updatedAt;
};
exports.Driver = Driver;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Driver.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Driver.prototype, "driverCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store),
    __metadata("design:type", store_entity_1.Store)
], Driver.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Driver.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Driver.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Driver.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Driver.prototype, "licenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Driver.prototype, "licenseExpiration", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ACTIVE' }),
    __metadata("design:type", String)
], Driver.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Driver.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Driver.prototype, "updatedAt", void 0);
exports.Driver = Driver = __decorate([
    (0, typeorm_1.Entity)('drivers')
], Driver);
//# sourceMappingURL=driver.entity.js.map