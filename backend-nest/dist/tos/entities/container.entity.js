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
exports.Container = void 0;
const typeorm_1 = require("typeorm");
const yard_entity_1 = require("./yard.entity");
let Container = class Container {
    id;
    containerNumber;
    type;
    loadStatus;
    yard;
    locationInYard;
    status;
    createdAt;
    updatedAt;
};
exports.Container = Container;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Container.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Container.prototype, "containerNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Container.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'empty' }),
    __metadata("design:type", String)
], Container.prototype, "loadStatus", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => yard_entity_1.Yard, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'yard_id' }),
    __metadata("design:type", yard_entity_1.Yard)
], Container.prototype, "yard", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Container.prototype, "locationInYard", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'available' }),
    __metadata("design:type", String)
], Container.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Container.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Container.prototype, "updatedAt", void 0);
exports.Container = Container = __decorate([
    (0, typeorm_1.Entity)('tos_containers')
], Container);
//# sourceMappingURL=container.entity.js.map