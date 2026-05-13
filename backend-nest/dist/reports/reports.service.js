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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../orders/entities/order.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const quotation_entity_1 = require("../quotations/entities/quotation.entity");
const store_entity_1 = require("../stores/entities/store.entity");
const user_entity_1 = require("../users/entities/user.entity");
const trip_entity_1 = require("../transport/entities/trip.entity");
const inventory_item_entity_1 = require("../storage/entities/inventory-item.entity");
const commission_entity_1 = require("../commissions/entities/commission.entity");
let ReportsService = class ReportsService {
    usersRepository;
    storesRepository;
    quotationsRepository;
    ordersRepository;
    paymentsRepository;
    tripsRepository;
    inventoryRepository;
    commissionsRepository;
    constructor(usersRepository, storesRepository, quotationsRepository, ordersRepository, paymentsRepository, tripsRepository, inventoryRepository, commissionsRepository) {
        this.usersRepository = usersRepository;
        this.storesRepository = storesRepository;
        this.quotationsRepository = quotationsRepository;
        this.ordersRepository = ordersRepository;
        this.paymentsRepository = paymentsRepository;
        this.tripsRepository = tripsRepository;
        this.inventoryRepository = inventoryRepository;
        this.commissionsRepository = commissionsRepository;
    }
    async getExecutiveSummary() {
        const [totalUsers, totalStores, totalQuotations, activeOrders, totalPayments, confirmedPayments, totalTrips, totalInventoryItems, totalCommissions] = await Promise.all([
            this.usersRepository.count(),
            this.storesRepository.count({ where: { status: 'approved' } }),
            this.quotationsRepository.count(),
            this.ordersRepository.count({ where: { operationalStatus: 'EXECUTING' } }),
            this.paymentsRepository.count(),
            this.paymentsRepository.find({ where: { status: 'CONFIRMED' } }),
            this.tripsRepository.count(),
            this.inventoryRepository.count(),
            this.commissionsRepository.find({ where: { status: 'CONFIRMED' } })
        ]);
        const revenue = confirmedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const marketplaceCommissions = totalCommissions.reduce((sum, c) => sum + Number(c.amount), 0);
        return {
            kpis: {
                users: totalUsers,
                activeStores: totalStores,
                quotations: totalQuotations,
                executingOrders: activeOrders,
                totalPayments,
                confirmedRevenue: revenue,
                marketplaceCommissions,
                tripsInProgress: totalTrips,
                itemsInStorage: totalInventoryItems
            },
            generatedAt: new Date().toISOString()
        };
    }
    async getStoreDashboard(storeId) {
        const [quotations, orders, commissions] = await Promise.all([
            this.quotationsRepository.count({ where: { store: { id: storeId } } }),
            this.ordersRepository.count({ where: { store: { id: storeId } } }),
            this.commissionsRepository.find({ where: { store: { id: storeId } } })
        ]);
        const totalEarned = commissions
            .filter(c => c.status === 'CONFIRMED')
            .reduce((sum, c) => sum + Number(c.amount), 0);
        return {
            quotationsCount: quotations,
            activeOrdersCount: orders,
            totalCommissions: totalEarned,
            storeRating: 5.0
        };
    }
    async getClientDashboard(userId) {
        const [quotations, orders] = await Promise.all([
            this.quotationsRepository.count({ where: { client: { id: userId } } }),
            this.ordersRepository.count({ where: { client: { id: userId } } })
        ]);
        return {
            quotationsCount: quotations,
            activeOrdersCount: orders,
            documentsCount: 0
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(2, (0, typeorm_1.InjectRepository)(quotation_entity_1.Quotation)),
    __param(3, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(4, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(5, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __param(6, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __param(7, (0, typeorm_1.InjectRepository)(commission_entity_1.Commission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map