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
exports.CommissionRule = void 0;
const typeorm_1 = require("typeorm");
const store_entity_1 = require("../../stores/entities/store.entity");
let CommissionRule = class CommissionRule {
    id;
    ruleCode;
    ruleName;
    commissionType;
    percentage;
    fixedAmount;
    serviceCategory;
    store;
    priority;
    status;
    createdAt;
    updatedAt;
};
exports.CommissionRule = CommissionRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CommissionRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CommissionRule.prototype, "ruleCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CommissionRule.prototype, "ruleName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CommissionRule.prototype, "commissionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], CommissionRule.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], CommissionRule.prototype, "fixedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CommissionRule.prototype, "serviceCategory", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, { nullable: true }),
    __metadata("design:type", store_entity_1.Store)
], CommissionRule.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], CommissionRule.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ACTIVE' }),
    __metadata("design:type", String)
], CommissionRule.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CommissionRule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CommissionRule.prototype, "updatedAt", void 0);
exports.CommissionRule = CommissionRule = __decorate([
    (0, typeorm_1.Entity)('commission_rules')
], CommissionRule);
//# sourceMappingURL=commission_rule.entity.js.map