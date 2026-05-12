import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { AuditService } from '../audit/audit.service';
import { Payment } from '../payments/entities/payment.entity';
export declare class OrdersService {
    private ordersRepository;
    private paymentsRepository;
    private auditService;
    constructor(ordersRepository: Repository<Order>, paymentsRepository: Repository<Payment>, auditService: AuditService);
    createFromQuotation(quotation: Quotation): Promise<Order>;
    private userId;
    findAllForUser(user: any): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    updateStatus(id: number, status: string, user: any): Promise<Order>;
}
