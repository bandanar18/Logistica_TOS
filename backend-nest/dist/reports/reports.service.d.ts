import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { Trip } from '../transport/entities/trip.entity';
import { InventoryItem } from '../storage/entities/inventory-item.entity';
import { Commission } from '../commissions/entities/commission.entity';
export declare class ReportsService {
    private usersRepository;
    private storesRepository;
    private quotationsRepository;
    private ordersRepository;
    private paymentsRepository;
    private tripsRepository;
    private inventoryRepository;
    private commissionsRepository;
    constructor(usersRepository: Repository<User>, storesRepository: Repository<Store>, quotationsRepository: Repository<Quotation>, ordersRepository: Repository<Order>, paymentsRepository: Repository<Payment>, tripsRepository: Repository<Trip>, inventoryRepository: Repository<InventoryItem>, commissionsRepository: Repository<Commission>);
    getExecutiveSummary(): Promise<{
        kpis: {
            users: number;
            activeStores: number;
            quotations: number;
            executingOrders: number;
            totalPayments: number;
            confirmedRevenue: number;
            marketplaceCommissions: number;
            tripsInProgress: number;
            itemsInStorage: number;
        };
        generatedAt: string;
    }>;
    getStoreDashboard(storeId: number): Promise<{
        quotationsCount: number;
        activeOrdersCount: number;
        totalCommissions: number;
        storeRating: number;
    }>;
    getClientDashboard(userId: number): Promise<{
        quotationsCount: number;
        activeOrdersCount: number;
        documentsCount: number;
    }>;
}
