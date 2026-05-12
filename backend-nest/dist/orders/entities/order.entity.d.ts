import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { Service } from '../../services/entities/service.entity';
import { Quotation } from '../../quotations/entities/quotation.entity';
export declare class Order {
    id: number;
    quotation: Quotation;
    client: User;
    store: Store;
    service: Service;
    finalPrice: number;
    status: string;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
