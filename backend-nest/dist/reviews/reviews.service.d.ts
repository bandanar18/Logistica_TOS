import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Store } from '../stores/entities/store.entity';
import { AuditService } from '../audit/audit.service';
import { Order } from '../orders/entities/order.entity';
export declare class ReviewsService {
    private reviewRepo;
    private storeRepo;
    private orderRepo;
    private auditService;
    constructor(reviewRepo: Repository<Review>, storeRepo: Repository<Store>, orderRepo: Repository<Order>, auditService: AuditService);
    private userId;
    findAll(): Promise<Review[]>;
    findByStore(storeId: number): Promise<Review[]>;
    findAllForUser(user: any): Promise<Review[]>;
    create(data: any, user: any): Promise<Review>;
}
