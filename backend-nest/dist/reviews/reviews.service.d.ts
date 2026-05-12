import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Store } from '../stores/entities/store.entity';
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';
export declare class ReviewsService {
    private reviewRepo;
    private storeRepo;
    private auditService;
    constructor(reviewRepo: Repository<Review>, storeRepo: Repository<Store>, auditService: AuditService);
    findAll(): Promise<Review[]>;
    findByStore(storeId: number): Promise<Review[]>;
    create(data: any, user: User): Promise<Review>;
}
