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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./entities/review.entity");
const store_entity_1 = require("../stores/entities/store.entity");
const audit_service_1 = require("../audit/audit.service");
const order_entity_1 = require("../orders/entities/order.entity");
let ReviewsService = class ReviewsService {
    reviewRepo;
    storeRepo;
    orderRepo;
    auditService;
    constructor(reviewRepo, storeRepo, orderRepo, auditService) {
        this.reviewRepo = reviewRepo;
        this.storeRepo = storeRepo;
        this.orderRepo = orderRepo;
        this.auditService = auditService;
    }
    userId(user) {
        return user.sub || user.id;
    }
    async findAll() {
        return this.reviewRepo.find({ relations: ['user', 'store', 'order'] });
    }
    async findByStore(storeId) {
        return this.reviewRepo.find({
            where: { store: { id: storeId } },
            relations: ['user', 'order'],
            order: { createdAt: 'DESC' }
        });
    }
    async findAllForUser(user) {
        if (user.role === 'admin') {
            return this.reviewRepo.find({ relations: ['user', 'store', 'order'], order: { createdAt: 'DESC' } });
        }
        if (user.role === 'store') {
            return this.reviewRepo.find({
                where: { store: { owner: { id: this.userId(user) } } },
                relations: ['user', 'store', 'order'],
                order: { createdAt: 'DESC' },
            });
        }
        return this.reviewRepo.find({
            where: { user: { id: this.userId(user) } },
            relations: ['user', 'store', 'order'],
            order: { createdAt: 'DESC' },
        });
    }
    async create(data, user) {
        if (!data.orderId)
            throw new common_1.BadRequestException('Order is required to create a review');
        if (!data.rating || data.rating < 1 || data.rating > 5)
            throw new common_1.BadRequestException('Rating must be between 1 and 5');
        const order = await this.orderRepo.findOne({ where: { id: +data.orderId }, relations: ['client', 'store'] });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.client.id !== this.userId(user))
            throw new common_1.ForbiddenException('Only the order client can review it');
        if (order.status !== 'completed')
            throw new common_1.BadRequestException('Only completed orders can be reviewed');
        const existing = await this.reviewRepo.findOne({ where: { order: { id: order.id }, user: { id: this.userId(user) } } });
        if (existing)
            throw new common_1.BadRequestException('This order already has a review from this client');
        const store = await this.storeRepo.findOne({ where: { id: order.store.id } });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        const review = this.reviewRepo.create({
            rating: data.rating,
            comment: data.comment,
            user: { id: this.userId(user) },
            store,
            order,
        });
        const saved = await this.reviewRepo.save(review);
        const reviews = await this.reviewRepo.find({ where: { store: { id: store.id } } });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        store.averageRating = totalRating / reviews.length;
        store.reviewCount = reviews.length;
        await this.storeRepo.save(store);
        await this.auditService.log({
            user: { id: this.userId(user) },
            module: 'reviews',
            action: 'review.created',
            entityType: 'review',
            entityId: saved.id.toString(),
            details: { rating: saved.rating, storeId: store.id }
        });
        return saved;
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map