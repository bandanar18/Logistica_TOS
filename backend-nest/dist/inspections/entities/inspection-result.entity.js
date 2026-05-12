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
exports.InspectionResult = void 0;
const typeorm_1 = require("typeorm");
const inspection_entity_1 = require("./inspection.entity");
let InspectionResult = class InspectionResult {
    id;
    inspection;
    findings;
    verdict;
    checklist;
    createdAt;
};
exports.InspectionResult = InspectionResult;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InspectionResult.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => inspection_entity_1.Inspection),
    (0, typeorm_1.JoinColumn)({ name: 'inspection_id' }),
    __metadata("design:type", inspection_entity_1.Inspection)
], InspectionResult.prototype, "inspection", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], InspectionResult.prototype, "findings", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InspectionResult.prototype, "verdict", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], InspectionResult.prototype, "checklist", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], InspectionResult.prototype, "createdAt", void 0);
exports.InspectionResult = InspectionResult = __decorate([
    (0, typeorm_1.Entity)('inspection_results')
], InspectionResult);
//# sourceMappingURL=inspection-result.entity.js.map