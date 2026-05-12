import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Store) private storesRepository: Repository<Store>,
    @InjectRepository(Quotation) private quotationsRepository: Repository<Quotation>,
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(Payment) private paymentsRepository: Repository<Payment>,
  ) {}

  async summary() {
    const [users, stores, quotations, orders, payments, confirmedPayments] = await Promise.all([
      this.usersRepository.count(),
      this.storesRepository.count(),
      this.quotationsRepository.count(),
      this.ordersRepository.count(),
      this.paymentsRepository.count(),
      this.paymentsRepository.find({ where: { status: 'confirmed' } }),
    ]);

    const confirmedRevenue = confirmedPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    return [{
      id: 'mvp-summary',
      users,
      stores,
      quotations,
      orders,
      payments,
      confirmedRevenue,
      generatedAt: new Date().toISOString(),
    }];
  }
}
