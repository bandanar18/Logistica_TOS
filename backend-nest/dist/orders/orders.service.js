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
const transport_service_1 = require("../transport/transport.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const audit_service_1 = require("../audit/audit.service");
const payment_entity_1 = require("../payments/entities/payment.entity");
let OrdersService = class OrdersService {
    ordersRepository;
    paymentsRepository;
    transportService;
    auditService;
    constructor(ordersRepository, paymentsRepository, transportService, auditService) {
        this.ordersRepository = ordersRepository;
        this.paymentsRepository = paymentsRepository;
        this.transportService = transportService;
        this.auditService = auditService;
    }
    userId(user) {
        return user.sub || user.id;
    }
    async generateOrderCode() {
        const year = new Date().getFullYear();
        const count = await this.ordersRepository.count();
        return `ORD-${year}-${(count + 1).toString().padStart(4, '0')}`;
    }
    async createFromQuotation(quotation) {
        const existing = await this.ordersRepository.findOne({ where: { quotation: { id: quotation.id } } });
        if (existing)
            return existing;
        const order = this.ordersRepository.create({
            orderCode: await this.generateOrderCode(),
            quotation,
            client: quotation.client,
            store: quotation.store,
            service: quotation.service,
            subtotalAmount: quotation.subtotalAmount,
            taxAmount: quotation.taxAmount,
            commissionAmount: quotation.commissionAmount,
            totalAmount: quotation.totalAmount,
            providerNetAmount: (quotation.subtotalAmount || 0) - (quotation.commissionAmount || 0),
            currency: quotation.currency,
            operationalStatus: 'CREATED',
            financialStatus: 'UNPAID',
            documentStatus: quotation.status === 'CONVERTED' ? 'VALIDATED' : 'PENDING',
        });
        const saved = await this.ordersRepository.save(order);
        await this.auditService.log({
            module: 'orders',
            action: 'order.created',
            entityType: 'order',
            entityId: saved.id.toString(),
            entityCode: saved.orderCode,
            severity: 'HIGH',
            newValues: { quotationCode: quotation.quotationCode, totalAmount: saved.totalAmount }
        });
        return saved;
    }
    async findAllForUser(user) {
        const qb = this.ordersRepository.createQueryBuilder('o')
            .leftJoinAndSelect('o.client', 'client')
            .leftJoinAndSelect('o.store', 'store')
            .leftJoinAndSelect('o.service', 'service')
            .leftJoinAndSelect('o.quotation', 'quotation')
            .leftJoinAndSelect('o.currency', 'currency')
            .orderBy('o.createdAt', 'DESC');
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
        const o = await this.ordersRepository.findOne({
            where: { id },
            relations: ['client', 'store', 'store.owner', 'service', 'quotation', 'currency'],
        });
        if (!o)
            throw new common_1.NotFoundException('Order not found');
        return o;
    }
    async start(id, user) {
        const o = await this.findOne(id);
        if (user.role !== 'admin' && o.store?.owner?.id !== this.userId(user)) {
            throw new common_1.ForbiddenException('Only the store owner can start this order');
        }
        if (o.operationalStatus !== 'CREATED')
            throw new common_1.BadRequestException('Order already started or invalid status');
        const oldStatus = o.operationalStatus;
        o.operationalStatus = 'IN_PROCESS';
        o.startedAt = new Date();
        const saved = await this.ordersRepository.save(o);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'orders',
            action: 'order.started',
            entityType: 'order',
            entityId: id.toString(),
            entityCode: saved.orderCode,
            oldValues: { status: oldStatus },
            newValues: { status: saved.operationalStatus },
            severity: 'MEDIUM'
        });
        if (o.service?.category?.itemCode === 'TRANSPORT_SERVICE') {
            await this.transportService.createTrip({
                order: saved,
                carrier: o.store,
                tripType: 'STANDARD',
                originName: 'PORT',
                originAddress: 'PORT AREA',
                destinationName: 'WAREHOUSE',
                destinationAddress: 'CLIENT AREA',
                status: 'CREATED'
            }, user);
        }
        return saved;
    }
    async updateStatus(id, status, user) {
        const o = await this.findOne(id);
        if (user.role !== 'admin' && o.store?.owner?.id !== this.userId(user)) {
            throw new common_1.ForbiddenException('Only authorized users can update this order');
        }
        const oldStatus = o.operationalStatus;
        const validOps = ['IN_PROCESS', 'EXECUTING', 'ON_HOLD', 'CLOSED', 'CANCELLED'];
        if (validOps.includes(status)) {
            o.operationalStatus = status;
            if (status === 'CLOSED')
                o.closedAt = new Date();
            if (status === 'CANCELLED')
                o.cancelledAt = new Date();
        }
        const saved = await this.ordersRepository.save(o);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'orders',
            action: 'order.status_changed',
            entityType: 'order',
            entityId: id.toString(),
            entityCode: saved.orderCode,
            oldValues: { status: oldStatus },
            newValues: { status: saved.operationalStatus },
            severity: (status === 'CLOSED' || status === 'CANCELLED') ? 'CRITICAL' : 'HIGH'
        });
        return saved;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => transport_service_1.TransportService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        transport_service_1.TransportService,
        audit_service_1.AuditService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map