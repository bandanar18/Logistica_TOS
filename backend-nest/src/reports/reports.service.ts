import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { Trip } from '../transport/entities/trip.entity';
import { InventoryItem } from '../storage/entities/inventory-item.entity';
import { Commission } from '../commissions/entities/commission.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Store) private storesRepository: Repository<Store>,
    @InjectRepository(Quotation) private quotationsRepository: Repository<Quotation>,
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(Payment) private paymentsRepository: Repository<Payment>,
    @InjectRepository(Trip) private tripsRepository: Repository<Trip>,
    @InjectRepository(InventoryItem) private inventoryRepository: Repository<InventoryItem>,
    @InjectRepository(Commission) private commissionsRepository: Repository<Commission>,
  ) {}

  async getExecutiveSummary() {
    const [
      totalUsers,
      totalStores,
      totalQuotations,
      activeOrders,
      totalPayments,
      confirmedPayments,
      totalTrips,
      totalInventoryItems,
      totalCommissions
    ] = await Promise.all([
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

  async getStoreDashboard(storeId: number) {
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
      storeRating: 5.0 // Placeholder
    };
  }

  async getClientDashboard(userId: number) {
    const [quotations, orders] = await Promise.all([
      this.quotationsRepository.count({ where: { client: { id: userId } } }),
      this.ordersRepository.count({ where: { client: { id: userId } } })
    ]);

    return {
      quotationsCount: quotations,
      activeOrdersCount: orders,
      documentsCount: 0 // Placeholder
    };
  }
}
