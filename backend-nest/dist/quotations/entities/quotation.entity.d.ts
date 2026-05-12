import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { Service } from '../../services/entities/service.entity';
export declare class Quotation {
    id: number;
    client: User;
    store: Store;
    service: Service;
    price: number;
    notes: string;
    responseNotes: string;
    status: string;
    respondedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
