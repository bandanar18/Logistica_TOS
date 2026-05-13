import { Warehouse } from '../../warehouses/entities/warehouse.entity';
export declare class StorageLocation {
    id: number;
    locationCode: string;
    warehouse: Warehouse;
    zone: string;
    aisle: string;
    rack: string;
    position: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
