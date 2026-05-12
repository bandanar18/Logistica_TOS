import { Warehouse } from './warehouse.entity';
import { StorageLocation } from './storage-location.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class InventoryItem {
    id: number;
    sku: string;
    description: string;
    quantity: number;
    unit: string;
    warehouse: Warehouse;
    location: StorageLocation;
    order: Order;
    createdAt: Date;
    updatedAt: Date;
}
