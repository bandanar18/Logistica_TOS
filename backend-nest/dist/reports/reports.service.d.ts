import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
export declare class ReportsService {
    private usersRepository;
    private storesRepository;
    private quotationsRepository;
    private ordersRepository;
    private paymentsRepository;
    constructor(usersRepository: Repository<User>, storesRepository: Repository<Store>, quotationsRepository: Repository<Quotation>, ordersRepository: Repository<Order>, paymentsRepository: Repository<Payment>);
    summary(): Promise<{
        id: string;
        users: number;
        stores: number;
        quotations: number;
        orders: number;
        payments: number;
        confirmedRevenue: number;
        generatedAt: string;
    }[]>;
}
