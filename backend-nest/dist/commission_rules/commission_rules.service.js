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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionRulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const commission_rule_entity_1 = require("./entities/commission_rule.entity");
let CommissionRulesService = class CommissionRulesService {
    rulesRepo;
    constructor(rulesRepo) {
        this.rulesRepo = rulesRepo;
    }
    async findBestRule(category, storeId) {
        const rules = await this.rulesRepo.find({
            where: { status: 'ACTIVE' },
            order: { priority: 'DESC' },
            relations: ['store'],
        });
        if (storeId && category) {
            const match = rules.find(r => r.store?.id === storeId && r.serviceCategory === category);
            if (match)
                return match;
        }
        if (storeId) {
            const match = rules.find(r => r.store?.id === storeId && !r.serviceCategory);
            if (match)
                return match;
        }
        if (category) {
            const match = rules.find(r => r.serviceCategory === category && !r.store);
            if (match)
                return match;
        }
        return rules.find(r => !r.store && !r.serviceCategory) || null;
    }
    calculateCommission(rule, amount) {
        if (rule.commissionType === 'PERCENTAGE') {
            return Number(amount) * (Number(rule.percentage) / 100);
        }
        if (rule.commissionType === 'FIXED_AMOUNT') {
            return Number(rule.fixedAmount);
        }
        return 0;
    }
};
exports.CommissionRulesService = CommissionRulesService;
exports.CommissionRulesService = CommissionRulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(commission_rule_entity_1.CommissionRule)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CommissionRulesService);
//# sourceMappingURL=commission_rules.service.js.map