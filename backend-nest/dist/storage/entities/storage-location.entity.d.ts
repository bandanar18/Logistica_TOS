import { Warehouse } from './warehouse.entity';
export declare class StorageLocation {
    id: number;
    warehouse: Warehouse;
    aisle: string;
    shelf: string;
    level: string;
    status: string;
}
