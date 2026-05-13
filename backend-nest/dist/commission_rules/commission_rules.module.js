"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionRulesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const commission_rules_service_1 = require("./commission_rules.service");
const commission_rules_controller_1 = require("./commission_rules.controller");
const commission_rule_entity_1 = require("./entities/commission_rule.entity");
let CommissionRulesModule = class CommissionRulesModule {
};
exports.CommissionRulesModule = CommissionRulesModule;
exports.CommissionRulesModule = CommissionRulesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([commission_rule_entity_1.CommissionRule])],
        controllers: [commission_rules_controller_1.CommissionRulesController],
        providers: [commission_rules_service_1.CommissionRulesService],
        exports: [commission_rules_service_1.CommissionRulesService],
    })
], CommissionRulesModule);
//# sourceMappingURL=commission_rules.module.js.map