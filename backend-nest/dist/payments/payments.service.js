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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const audit_service_1 = require("../audit/audit.service");
const order_entity_1 = require("../orders/entities/order.entity");
let PaymentsService = class PaymentsService {
    paymentsRepository;
    ordersRepository;
    auditService;
    constructor(paymentsRepository, ordersRepository, auditService) {
        this.paymentsRepository = paymentsRepository;
        this.ordersRepository = ordersRepository;
        this.auditService = auditService;
    }
    userId(user) {
        return user.sub || user.id;
    }
    async generatePaymentCode() {
        const count = await this.paymentsRepository.count();
        const year = new Date().getFullYear();
        return `PAY-${year}-${(count + 1).toString().padStart(5, '0')}`;
    }
    async create(createDto, client) {
        const orderId = createDto.order?.id || createDto.orderId;
        if (!orderId)
            throw new common_1.BadRequestException('Order is required');
        const order = await this.ordersRepository.findOne({ where: { id: +orderId }, relations: ['client'] });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.client.id !== this.userId(client))
            throw new common_1.ForbiddenException('Only the order client can register payments');
        const payment = this.paymentsRepository.create({
            ...createDto,
            paymentCode: await this.generatePaymentCode(),
            order,
            client: { id: this.userId(client) },
            status: createDto.receiptUrl ? 'SUBMITTED' : 'CREATED',
        });
        const saved = await this.paymentsRepository.save(payment);
        order.financialStatus = saved.status;
        await this.ordersRepository.save(order);
        await this.auditService.log({
            user: { id: this.userId(client) },
            module: 'payments',
            action: 'payment.created',
            entityType: 'payment',
            entityId: saved.id.toString(),
            entityCode: saved.paymentCode,
            severity: 'MEDIUM',
            newValues: { amount: saved.amount, orderId: order.id, code: saved.paymentCode }
        });
        return saved;
    }
    async findAllForUser(user) {
        const qb = this.paymentsRepository.createQueryBuilder('p')
            .leftJoinAndSelect('p.client', 'client')
            .leftJoinAndSelect('p.order', 'order')
            .leftJoinAndSelect('order.store', 'store')
            .orderBy('p.createdAt', 'DESC');
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
    async startReview(id, user) {
        const p = await this.paymentsRepository.findOne({ where: { id }, relations: ['order'] });
        if (!p)
            throw new common_1.NotFoundException('Payment not found');
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException('Only admins/operators can review payments');
        const oldStatus = p.status;
        p.status = 'IN_REVIEW';
        const saved = await this.paymentsRepository.save(p);
        p.order.financialStatus = 'IN_REVIEW';
        await this.ordersRepository.save(p.order);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'payments',
            action: 'payment.in_review',
            entityType: 'payment',
            entityId: id.toString(),
            entityCode: p.paymentCode,
            oldValues: { status: oldStatus },
            newValues: { status: p.status },
            severity: 'MEDIUM'
        });
        return saved;
    }
    async confirm(id, user) {
        const p = await this.paymentsRepository.findOne({ where: { id }, relations: ['client', 'order'] });
        if (!p)
            throw new common_1.NotFoundException('Payment not found');
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException('Only admins can confirm payments');
        const oldStatus = p.status;
        p.status = 'CONFIRMED';
        p.confirmedAt = new Date();
        const saved = await this.paymentsRepository.save(p);
        p.order.financialStatus = 'CONFIRMED';
        await this.ordersRepository.save(p.order);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'payments',
            action: 'payment.confirmed',
            entityType: 'payment',
            entityId: id.toString(),
            entityCode: p.paymentCode,
            oldValues: { status: oldStatus },
            newValues: { status: p.status },
            severity: 'CRITICAL'
        });
        return saved;
    }
    async reject(id, reason, user) {
        if (!reason)
            throw new common_1.BadRequestException('Rejection reason is required');
        const p = await this.paymentsRepository.findOne({ where: { id }, relations: ['client', 'order'] });
        if (!p)
            throw new common_1.NotFoundException('Payment not found');
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException('Only admins can reject payments');
        const oldStatus = p.status;
        p.status = 'REJECTED';
        p.rejectionReason = reason;
        const saved = await this.paymentsRepository.save(p);
        p.order.financialStatus = 'REJECTED';
        await this.ordersRepository.save(p.order);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'payments',
            action: 'payment.rejected',
            entityType: 'payment',
            entityId: id.toString(),
            entityCode: p.paymentCode,
            oldValues: { status: oldStatus },
            newValues: { status: p.status, reason },
            severity: 'HIGH',
            changeReason: reason
        });
        return saved;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map