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
exports.InspectionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inspection_entity_1 = require("./entities/inspection.entity");
const inspection_result_entity_1 = require("./entities/inspection-result.entity");
const audit_service_1 = require("../audit/audit.service");
let InspectionsService = class InspectionsService {
    inspectionRepo;
    resultRepo;
    auditService;
    constructor(inspectionRepo, resultRepo, auditService) {
        this.inspectionRepo = inspectionRepo;
        this.resultRepo = resultRepo;
        this.auditService = auditService;
    }
    async findAll() {
        return this.inspectionRepo.find({ relations: ['order', 'inspector'] });
    }
    async create(data, user) {
        const inspection = this.inspectionRepo.create(data);
        const saved = await this.inspectionRepo.save(inspection);
        await this.auditService.log({
            user,
            module: 'inspections',
            action: 'inspection.created',
            entityType: 'inspection',
            entityId: saved.id.toString(),
            details: { type: saved.inspectionType }
        });
        return saved;
    }
    async saveResult(id, resultData, user) {
        const inspection = await this.inspectionRepo.findOne({ where: { id } });
        if (!inspection)
            throw new common_1.NotFoundException('Inspection not found');
        const result = this.resultRepo.create({
            ...resultData,
            inspection
        });
        const savedResult = await this.resultRepo.save(result);
        inspection.status = 'completed';
        await this.inspectionRepo.save(inspection);
        await this.auditService.log({
            user,
            module: 'inspections',
            action: 'inspection.result.created',
            entityType: 'inspection',
            entityId: id.toString(),
            details: { verdict: savedResult.verdict }
        });
        return savedResult;
    }
};
exports.InspectionsService = InspectionsService;
exports.InspectionsService = InspectionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inspection_entity_1.Inspection)),
    __param(1, (0, typeorm_1.InjectRepository)(inspection_result_entity_1.InspectionResult)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService])
], InspectionsService);
//# sourceMappingURL=inspections.service.js.map