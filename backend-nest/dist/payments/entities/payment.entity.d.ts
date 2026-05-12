import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class Payment {
    id: number;
    order: Order;
    client: User;
    amount: number;
    currency: string;
    paymentMethod: string;
    reference: string;
    receiptUrl: string;
    status: string;
    confirmedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
