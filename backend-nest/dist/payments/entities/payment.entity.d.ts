import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class Payment {
    id: number;
    paymentCode: string;
    order: Order;
    client: User;
    amount: number;
    currency: string;
    paymentMethod: string;
    paymentReference: string;
    receiptUrl: string;
    status: string;
    rejectionReason: string;
    confirmedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
