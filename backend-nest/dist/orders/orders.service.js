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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const audit_service_1 = require("../audit/audit.service");
const payment_entity_1 = require("../payments/entities/payment.entity");
let OrdersService = class OrdersService {
    ordersRepository;
    paymentsRepository;
    auditService;
    constructor(ordersRepository, paymentsRepository, auditService) {
        this.ordersRepository = ordersRepository;
        this.paymentsRepository = paymentsRepository;
        this.auditService = auditService;
    }
    async createFromQuotation(quotation) {
        const existing = await this.ordersRepository.findOne({ where: { quotation: { id: quotation.id } } });
        if (existing)
            return existing;
        const order = this.ordersRepository.create({
            quotation,
            client: quotation.client,
            store: quotation.store,
            service: quotation.service,
            finalPrice: quotation.price,
            status: 'pending',
        });
        const saved = await this.ordersRepository.save(order);
        await this.auditService.log({
            module: 'orders',
            action: 'order.created',
            entityType: 'order',
            entityId: saved.id.toString(),
            details: { quotationId: quotation.id }
        });
        return saved;
    }
    userId(user) {
        return user.sub || user.id;
    }
    async findAllForUser(user) {
        if (user.role === 'admin' || user.role?.name === 'admin') {
            return this.ordersRepository.find({
                relations: ['client', 'service', 'quotation', 'store'],
                order: { createdAt: 'DESC' },
            });
        }
        if (user.role === 'store' || user.role?.name === 'store') {
            return this.ordersRepository.find({
                where: { store: { owner: { id: this.userId(user) } } },
                relations: ['client', 'service', 'quotation', 'store'],
                order: { createdAt: 'DESC' },
            });
        }
        return this.ordersRepository.find({
            where: { client: { id: this.userId(user) } },
            relations: ['store', 'service', 'quotation'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const o = await this.ordersRepository.findOne({
            where: { id },
            relations: ['client', 'store', 'store.owner', 'service', 'quotation'],
        });
        if (!o)
            throw new common_1.NotFoundException('Order not found');
        return o;
    }
    async updateStatus(id, status, user) {
        const o = await this.findOne(id);
        if (user.role !== 'admin' && o.store?.owner?.id !== this.userId(user)) {
            throw new common_1.ForbiddenException('Only the store owner can update this order');
        }
        if (status === 'in_progress') {
            const confirmedPayments = await this.paymentsRepository.find({ where: { order: { id }, status: 'confirmed' } });
            const paid = confirmedPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
            if (paid < Number(o.finalPrice)) {
                throw new common_1.ForbiddenException('Order cannot start until payment is fully confirmed');
            }
        }
        o.status = status;
        if (status === 'completed') {
            o.completedAt = new Date();
        }
        const saved = await this.ordersRepository.save(o);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'orders',
            action: 'order.status_changed',
            entityType: 'order',
            entityId: id.toString(),
            details: { status }
        });
        return saved;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map