import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class Review {
    id: number;
    rating: number;
    comment: string;
    user: User;
    store: Store;
    order: Order;
    createdAt: Date;
}
