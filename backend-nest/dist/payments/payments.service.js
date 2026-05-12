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
    async create(createDto, client) {
        const orderId = createDto.order?.id || createDto.orderId;
        if (!orderId)
            throw new common_1.BadRequestException('Order is required');
        const order = await this.ordersRepository.findOne({ where: { id: +orderId }, relations: ['client'] });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.client.id !== this.userId(client))
            throw new common_1.ForbiddenException('Only the order client can register payments');
        if (Number(createDto.amount) <= 0 || Number(createDto.amount) > Number(order.finalPrice)) {
            throw new common_1.BadRequestException('Payment amount is invalid for this order');
        }
        const payment = this.paymentsRepository.create({
            ...createDto,
            order,
            client: { id: this.userId(client) },
            status: 'pending',
        });
        const saved = await this.paymentsRepository.save(payment);
        await this.auditService.log({
            user: { id: this.userId(client) },
            module: 'payments',
            action: 'payment.created',
            entityType: 'payment',
            entityId: saved.id.toString(),
            details: { amount: saved.amount, orderId: createDto.order?.id }
        });
        return saved;
    }
    async findAllForUser(user) {
        if (user.role === 'admin' || user.role?.name === 'admin') {
            return this.paymentsRepository.find({ relations: ['client', 'order'], order: { createdAt: 'DESC' } });
        }
        if (user.role === 'store' || user.role?.name === 'store') {
            return this.paymentsRepository.find({
                where: { order: { store: { owner: { id: this.userId(user) } } } },
                relations: ['client', 'order', 'order.store'],
                order: { createdAt: 'DESC' },
            });
        }
        return this.paymentsRepository.find({
            where: { client: { id: this.userId(user) } },
            relations: ['order'],
            order: { createdAt: 'DESC' },
        });
    }
    async confirm(id, user) {
        const p = await this.paymentsRepository.findOne({ where: { id }, relations: ['client', 'order'] });
        if (!p)
            throw new common_1.NotFoundException('Payment not found');
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException('Only admins can confirm payments');
        p.status = 'confirmed';
        p.confirmedAt = new Date();
        const saved = await this.paymentsRepository.save(p);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'payments',
            action: 'payment.confirmed',
            entityType: 'payment',
            entityId: id.toString(),
            details: { previousStatus: 'pending' }
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