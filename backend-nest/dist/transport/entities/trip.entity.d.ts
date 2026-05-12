import { Vehicle } from './vehicle.entity';
import { Driver } from './driver.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class Trip {
    id: number;
    origin: string;
    destination: string;
    vehicle: Vehicle;
    driver: Driver;
    order: Order;
    status: string;
    startedAt: Date;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
