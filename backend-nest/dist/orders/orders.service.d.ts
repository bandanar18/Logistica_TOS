import { TransportService } from '../transport/transport.service';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { AuditService } from '../audit/audit.service';
import { Payment } from '../payments/entities/payment.entity';
export declare class OrdersService {
    private ordersRepository;
    private paymentsRepository;
    private transportService;
    private auditService;
    constructor(ordersRepository: Repository<Order>, paymentsRepository: Repository<Payment>, transportService: TransportService, auditService: AuditService);
    private userId;
    private generateOrderCode;
    createFromQuotation(quotation: Quotation): Promise<Order>;
    findAllForUser(user: any): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    start(id: number, user: any): Promise<Order>;
    updateStatus(id: number, status: string, user: any): Promise<Order>;
}
