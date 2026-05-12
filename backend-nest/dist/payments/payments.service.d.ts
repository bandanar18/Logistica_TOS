import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { AuditService } from '../audit/audit.service';
import { Order } from '../orders/entities/order.entity';
export declare class PaymentsService {
    private paymentsRepository;
    private ordersRepository;
    private auditService;
    constructor(paymentsRepository: Repository<Payment>, ordersRepository: Repository<Order>, auditService: AuditService);
    private userId;
    create(createDto: any, client: any): Promise<Payment>;
    findAllForUser(user: any): Promise<Payment[]>;
    confirm(id: number, user: any): Promise<Payment>;
}
