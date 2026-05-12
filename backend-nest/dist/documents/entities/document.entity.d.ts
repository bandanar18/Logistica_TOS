import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
export declare class Document {
    id: number;
    order: Order;
    uploadedBy: User;
    type: string;
    name: string;
    url: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
