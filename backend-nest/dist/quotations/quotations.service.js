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
const audit_service_1 = require("../audit/audit.service");
const store_entity_1 = require("../stores/entities/store.entity");
const service_entity_1 = require("../services/entities/service.entity");
const master_catalog_item_entity_1 = require("../catalogs/entities/master-catalog-item.entity");
const commission_rules_service_1 = require("../commission_rules/commission_rules.service");
let QuotationsService = class QuotationsService {
    quotationsRepository;
    storesRepository;
    servicesRepository;
    catalogItemRepository;
    commissionRulesService;
    auditService;
    constructor(quotationsRepository, storesRepository, servicesRepository, catalogItemRepository, commissionRulesService, auditService) {
        this.quotationsRepository = quotationsRepository;
        this.storesRepository = storesRepository;
        this.servicesRepository = servicesRepository;
        this.catalogItemRepository = catalogItemRepository;
        this.commissionRulesService = commissionRulesService;
        this.auditService = auditService;
    }
    userId(user) {
        return user.sub || user.id;
    }
    async generateQuotationCode() {
        const year = new Date().getFullYear();
        const count = await this.quotationsRepository.count();
        return `COT-${year}-${(count + 1).toString().padStart(4, '0')}`;
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
        const unitMeasure = createDto.unitMeasureId
            ? await this.catalogItemRepository.findOneBy({ id: createDto.unitMeasureId })
            : undefined;
        const quotation = this.quotationsRepository.create({
            quotationCode: await this.generateQuotationCode(),
            service,
            store,
            quantity: createDto.quantity || 1,
            unitMeasure: unitMeasure,
            notes: createDto.notes,
            client: { id: this.userId(client) },
            status: 'REQUESTED',
        });
        const saved = await this.quotationsRepository.save(quotation);
        await this.auditService.log({
            user: { id: this.userId(client) },
            module: 'quotations',
            action: 'quotation.created',
            entityType: 'quotation',
            entityId: saved.id.toString(),
            entityCode: saved.quotationCode,
            severity: 'MEDIUM',
            newValues: { serviceId, storeId }
        });
        return saved;
    }
    async findAllForUser(user) {
        const qb = this.quotationsRepository.createQueryBuilder('q')
            .leftJoinAndSelect('q.client', 'client')
            .leftJoinAndSelect('q.store', 'store')
            .leftJoinAndSelect('q.service', 'service')
            .leftJoinAndSelect('q.unitMeasure', 'unitMeasure')
            .orderBy('q.createdAt', 'DESC');
        if (user.role === 'admin') {
        }
        else if (user.role === 'store') {
            qb.where('store.ownerId = :ownerId', { ownerId: this.userId(user) });
        }
        else {
            qb.where('client.id = :clientId', { clientId: this.userId(user) });
        }
        return qb.getMany();
    }
    async findOne(id) {
        const q = await this.quotationsRepository.findOne({
            where: { id },
            relations: ['client', 'store', 'store.owner', 'service', 'unitMeasure', 'currency'],
        });
        if (!q)
            throw new common_1.NotFoundException('Quotation not found');
        return q;
    }
    async startReview(id, user) {
        const q = await this.findOne(id);
        if (user.role !== 'admin' && q.store?.owner?.id !== this.userId(user)) {
            throw new common_1.ForbiddenException('Only the store owner can update this quotation');
        }
        if (q.status !== 'REQUESTED')
            throw new common_1.BadRequestException('Can only start review for REQUESTED quotations');
        const oldStatus = q.status;
        q.status = 'IN_REVIEW';
        const saved = await this.quotationsRepository.save(q);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'quotations',
            action: 'quotation.in_review',
            entityType: 'quotation',
            entityId: id.toString(),
            entityCode: q.quotationCode,
            oldValues: { status: oldStatus },
            newValues: { status: q.status },
            severity: 'LOW'
        });
        return saved;
    }
    async respond(id, respondDto, user) {
        const q = await this.findOne(id);
        if (user.role !== 'admin' && q.store?.owner?.id !== this.userId(user)) {
            throw new common_1.ForbiddenException('Only the store owner can respond to this quotation');
        }
        if (!['REQUESTED', 'IN_REVIEW'].includes(q.status)) {
            throw new common_1.BadRequestException('Only requested or in-review quotations can be responded');
        }
        const subtotal = Number(respondDto.price);
        if (isNaN(subtotal) || subtotal <= 0)
            throw new common_1.BadRequestException('A valid price is required');
        const category = q.service?.category?.itemCode;
        const rule = await this.commissionRulesService.findBestRule(category, q.store?.id);
        const oldValues = { status: q.status, price: q.subtotalAmount };
        q.subtotalAmount = subtotal;
        q.commissionAmount = rule ? this.commissionRulesService.calculateCommission(rule, subtotal) : subtotal * 0.10;
        q.taxAmount = subtotal * 0.16;
        q.totalAmount = subtotal + q.taxAmount;
        if (respondDto.currencyId) {
            q.currency = { id: respondDto.currencyId };
        }
        q.responseNotes = respondDto.responseNotes;
        q.status = 'RESPONDED';
        q.respondedAt = new Date();
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        q.expiresAt = expires;
        const saved = await this.quotationsRepository.save(q);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'quotations',
            action: 'quotation.responded',
            entityType: 'quotation',
            entityId: id.toString(),
            entityCode: q.quotationCode,
            oldValues,
            newValues: { status: q.status, total: q.totalAmount, ruleApplied: rule?.ruleCode || 'DEFAULT_10' },
            severity: 'HIGH'
        });
        return saved;
    }
    async updateStatus(id, status, user) {
        const q = await this.findOne(id);
        const validStatuses = ['APPROVED', 'REJECTED', 'CONVERTED', 'CANCELLED'];
        if (!validStatuses.includes(status))
            throw new common_1.BadRequestException('Invalid status');
        if (q.client.id !== this.userId(user) && user.role !== 'admin') {
            throw new common_1.ForbiddenException('Only the client can update this status');
        }
        const oldStatus = q.status;
        if (status === 'APPROVED') {
            if (q.status !== 'RESPONDED')
                throw new common_1.BadRequestException('Only responded quotations can be approved');
            if (q.expiresAt && new Date() > q.expiresAt)
                throw new common_1.BadRequestException('Quotation has expired');
            q.approvedAt = new Date();
        }
        if (status === 'REJECTED') {
            q.rejectedAt = new Date();
        }
        q.status = status;
        const saved = await this.quotationsRepository.save(q);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'quotations',
            action: 'quotation.status_changed',
            entityType: 'quotation',
            entityId: id.toString(),
            entityCode: q.quotationCode,
            oldValues: { status: oldStatus },
            newValues: { status: saved.status },
            severity: status === 'APPROVED' ? 'HIGH' : 'MEDIUM'
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
    __param(3, (0, typeorm_1.InjectRepository)(master_catalog_item_entity_1.MasterCatalogItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        commission_rules_service_1.CommissionRulesService,
        audit_service_1.AuditService])
], QuotationsService);
//# sourceMappingURL=quotations.service.js.map