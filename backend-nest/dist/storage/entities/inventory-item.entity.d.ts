import { Warehouse } from './warehouse.entity';
import { StorageLocation } from './storage-location.entity';
import { Order } from '../../orders/entities/order.entity';
import { MasterCatalogItem } from '../../catalogs/entities/master-catalog-item.entity';
export declare class InventoryItem {
    id: number;
    sku: string;
    description: string;
    quantity: number;
    unit: MasterCatalogItem;
    warehouse: Warehouse;
    location: StorageLocation;
    order: Order;
    createdAt: Date;
    updatedAt: Date;
}
