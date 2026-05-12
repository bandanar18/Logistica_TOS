import { Order } from '../../orders/entities/order.entity';
import { Store } from '../../stores/entities/store.entity';
export declare class Commission {
    id: number;
    order: Order;
    store: Store;
    rate: number;
    amount: number;
    status: string;
    createdAt: Date;
}
