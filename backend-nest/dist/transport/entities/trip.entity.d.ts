import { Order } from '../../orders/entities/order.entity';
import { Vehicle } from './vehicle.entity';
import { Driver } from './driver.entity';
import { Store } from '../../stores/entities/store.entity';
export declare class Trip {
    id: number;
    tripCode: string;
    order: Order;
    carrier: Store;
    vehicle: Vehicle;
    driver: Driver;
    tripType: string;
    originName: string;
    originAddress: string;
    destinationName: string;
    destinationAddress: string;
    scheduledPickupAt: Date;
    scheduledDeliveryAt: Date;
    actualPickupAt: Date;
    actualDeliveryAt: Date;
    status: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
