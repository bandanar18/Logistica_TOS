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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_service_1 = require("../audit/audit.service");
const order_entity_1 = require("../orders/entities/order.entity");
const document_entity_1 = require("./entities/document.entity");
let DocumentsService = class DocumentsService {
    documentsRepository;
    ordersRepository;
    auditService;
    constructor(documentsRepository, ordersRepository, auditService) {
        this.documentsRepository = documentsRepository;
        this.ordersRepository = ordersRepository;
        this.auditService = auditService;
    }
    userId(user) {
        return user.sub || user.id;
    }
    async create(data, user) {
        const orderId = data.order?.id || data.orderId;
        if (!orderId || !data.type || !data.name || !data.url)
            throw new common_1.BadRequestException('Order, type, name and url are required');
        const order = await this.ordersRepository.findOne({ where: { id: +orderId }, relations: ['client', 'store', 'store.owner'] });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const allowed = user.role === 'admin' || order.client.id === this.userId(user) || order.store?.owner?.id === this.userId(user);
        if (!allowed)
            throw new common_1.ForbiddenException('You cannot upload documents for this order');
        const document = this.documentsRepository.create({
            order,
            uploadedBy: { id: this.userId(user) },
            type: data.type,
            name: data.name,
            url: data.url,
            status: 'pending',
        });
        const saved = await this.documentsRepository.save(document);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'documents',
            action: 'document.uploaded',
            entityType: 'document',
            entityId: saved.id.toString(),
            details: { orderId: order.id, type: data.type },
        });
        return saved;
    }
    async findAllForUser(user) {
        if (user.role === 'admin') {
            return this.documentsRepository.find({ relations: ['order', 'uploadedBy'], order: { createdAt: 'DESC' } });
        }
        if (user.role === 'store') {
            return this.documentsRepository.find({
                where: { order: { store: { owner: { id: this.userId(user) } } } },
                relations: ['order', 'uploadedBy'],
                order: { createdAt: 'DESC' },
            });
        }
        return this.documentsRepository.find({
            where: { order: { client: { id: this.userId(user) } } },
            relations: ['order', 'uploadedBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async updateStatus(id, status, user) {
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException('Only admins can validate documents');
        const document = await this.documentsRepository.findOne({ where: { id }, relations: ['order'] });
        if (!document)
            throw new common_1.NotFoundException('Document not found');
        document.status = status;
        return this.documentsRepository.save(document);
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map