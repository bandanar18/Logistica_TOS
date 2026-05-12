import { Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service';
import { Order } from '../orders/entities/order.entity';
import { Document } from './entities/document.entity';
export declare class DocumentsService {
    private documentsRepository;
    private ordersRepository;
    private auditService;
    constructor(documentsRepository: Repository<Document>, ordersRepository: Repository<Order>, auditService: AuditService);
    private userId;
    create(data: any, user: any): Promise<Document>;
    findAllForUser(user: any): Promise<Document[]>;
    updateStatus(id: number, status: string, user: any): Promise<Document>;
}
