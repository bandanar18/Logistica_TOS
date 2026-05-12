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
exports.TosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const container_entity_1 = require("./entities/container.entity");
const move_entity_1 = require("./entities/move.entity");
const yard_entity_1 = require("./entities/yard.entity");
const audit_service_1 = require("../audit/audit.service");
let TosService = class TosService {
    containerRepo;
    moveRepo;
    yardRepo;
    auditService;
    constructor(containerRepo, moveRepo, yardRepo, auditService) {
        this.containerRepo = containerRepo;
        this.moveRepo = moveRepo;
        this.yardRepo = yardRepo;
        this.auditService = auditService;
    }
    async findAllContainers() {
        return this.containerRepo.find({ relations: ['yard'] });
    }
    async createContainer(data, user) {
        const container = this.containerRepo.create(data);
        const saved = await this.containerRepo.save(container);
        await this.auditService.log({
            user,
            module: 'tos',
            action: 'tos.container.created',
            entityType: 'container',
            entityId: saved.id.toString(),
            details: { containerNumber: saved.containerNumber }
        });
        return saved;
    }
    async moveContainer(id, toYardId, toLocation, user) {
        const container = await this.containerRepo.findOne({ where: { id }, relations: ['yard'] });
        if (!container)
            throw new common_1.NotFoundException('Container not found');
        const toYard = await this.yardRepo.findOne({ where: { id: toYardId } });
        if (!toYard)
            throw new common_1.NotFoundException('Destination yard not found');
        const fromYard = container.yard;
        const fromLocation = container.locationInYard;
        const move = this.moveRepo.create({
            container,
            fromYard,
            toYard,
            fromLocation,
            toLocation,
            moveType: 'internal'
        });
        await this.moveRepo.save(move);
        container.yard = toYard;
        container.locationInYard = toLocation;
        const updated = await this.containerRepo.save(container);
        await this.auditService.log({
            user,
            module: 'tos',
            action: 'tos.container.moved',
            entityType: 'container',
            entityId: id.toString(),
            details: { fromYardId: fromYard?.id, toYardId, toLocation }
        });
        return updated;
    }
    async findAllYards() {
        return this.yardRepo.find();
    }
};
exports.TosService = TosService;
exports.TosService = TosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(container_entity_1.Container)),
    __param(1, (0, typeorm_1.InjectRepository)(move_entity_1.Move)),
    __param(2, (0, typeorm_1.InjectRepository)(yard_entity_1.Yard)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService])
], TosService);
//# sourceMappingURL=tos.service.js.map