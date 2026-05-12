import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class Inspection {
    id: number;
    inspectionType: string;
    order: Order;
    inspector: User;
    status: string;
    scheduledAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
