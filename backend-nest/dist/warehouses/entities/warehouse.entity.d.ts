import { Store } from '../../stores/entities/store.entity';
export declare class Warehouse {
    id: number;
    warehouseCode: string;
    warehouseName: string;
    store: Store;
    warehouseType: string;
    address: string;
    capacityUnits: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
