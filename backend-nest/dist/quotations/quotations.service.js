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
exports.QuotationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quotation_entity_1 = require("./entities/quotation.entity");
const user_entity_1 = require("../users/entities/user.entity");
const audit_service_1 = require("../audit/audit.service");
const store_entity_1 = require("../stores/entities/store.entity");
const service_entity_1 = require("../services/entities/service.entity");
let QuotationsService = class QuotationsService {
    quotationsRepository;
    storesRepository;
    servicesRepository;
    auditService;
    constructor(quotationsRepository, storesRepository, servicesRepository, auditService) {
        this.quotationsRepository = quotationsRepository;
        this.storesRepository = storesRepository;
        this.servicesRepository = servicesRepository;
        this.auditService = auditService;
    }
    userId(user) {
        return user.sub || user.id;
    }
    async create(createDto, client) {
        const serviceId = createDto.service?.id || createDto.serviceId;
        const storeId = createDto.store?.id || createDto.storeId;
        if (!serviceId || !storeId)
            throw new common_1.BadRequestException('Service and store are required');
        const [service, store] = await Promise.all([
            this.servicesRepository.findOne({ where: { id: +serviceId }, relations: ['store'] }),
            this.storesRepository.findOne({ where: { id: +storeId } }),
        ]);
        if (!service)
            throw new common_1.NotFoundException('Service not found');
        if (!store || store.status !== 'approved')
            throw new common_1.NotFoundException('Store not found or not approved');
        if (service.store?.id !== store.id)
            throw new common_1.BadRequestException('Service does not belong to selected store');
        const quotation = this.quotationsRepository.create({
            service,
            store,
            notes: createDto.notes,
            client: { id: this.userId(client) },
            status: 'pending',
        });
        const saved = await this.quotationsRepository.save(quotation);
        await this.auditService.log({
            user: { id: this.userId(client) },
            module: 'quotations',
            action: 'quotation.created',
            entityType: 'quotation',
            entityId: saved.id.toString(),
            details: { serviceId: createDto.service?.id }
        });
        return saved;
    }
    async findAllForUser(user) {
        if (user.role === 'admin') {
            return this.quotationsRepository.find({
                relations: ['client', 'service', 'store'],
                order: { createdAt: 'DESC' }
            });
        }
        const userWithRole = await this.quotationsRepository.manager.getRepository(user_entity_1.User).findOne({
            where: { id: this.userId(user) },
            relations: ['role']
        });
        if (userWithRole?.role?.name === 'store' || user.role === 'store') {
            return this.quotationsRepository.find({
                where: { store: { owner: { id: this.userId(user) } } },
                relations: ['client', 'service', 'store'],
                order: { createdAt: 'DESC' }
            });
        }
        return this.quotationsRepository.find({
            where: { client: { id: this.userId(user) } },
            relations: ['store', 'service'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const q = await this.quotationsRepository.findOne({
            where: { id },
            relations: ['client', 'store', 'store.owner', 'service'],
        });
        if (!q)
            throw new common_1.NotFoundException('Quotation not found');
        return q;
    }
    async respond(id, respondDto, user) {
        const q = await this.findOne(id);
        if (user.role !== 'admin' && q.store?.owner?.id !== this.userId(user)) {
            throw new common_1.ForbiddenException('Only the store owner can respond to this quotation');
        }
        if (q.status !== 'pending')
            throw new common_1.BadRequestException('Only pending quotations can be responded');
        if (!respondDto.price || Number(respondDto.price) <= 0)
            throw new common_1.BadRequestException('A valid price is required');
        q.price = respondDto.price;
        q.responseNotes = respondDto.responseNotes;
        q.status = 'responded';
        q.respondedAt = new Date();
        const saved = await this.quotationsRepository.save(q);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'quotations',
            action: 'quotation.responded',
            entityType: 'quotation',
            entityId: id.toString(),
            details: { price: q.price }
        });
        return saved;
    }
    async updateStatus(id, status, user) {
        const q = await this.findOne(id);
        if (!['approved', 'rejected', 'order_created'].includes(status))
            throw new common_1.BadRequestException('Invalid status transition');
        if (q.client.id !== this.userId(user) && user.role !== 'admin') {
            throw new common_1.ForbiddenException('Only the client can approve or reject the quotation');
        }
        if ((status === 'approved' || status === 'rejected') && q.status !== 'responded') {
            throw new common_1.BadRequestException('Only responded quotations can be approved or rejected');
        }
        q.status = status;
        const saved = await this.quotationsRepository.save(q);
        await this.auditService.log({
            user,
            module: 'quotations',
            action: 'quotation.status_changed',
            entityType: 'quotation',
            entityId: id.toString(),
            details: { status }
        });
        return saved;
    }
};
exports.QuotationsService = QuotationsService;
exports.QuotationsService = QuotationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quotation_entity_1.Quotation)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(2, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService])
], QuotationsService);
//# sourceMappingURL=quotations.service.js.map