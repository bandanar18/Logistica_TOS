import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { StorageLocation } from './entities/storage-location.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';
export declare class StorageService {
    private warehouseRepo;
    private locationRepo;
    private itemRepo;
    private auditService;
    constructor(warehouseRepo: Repository<Warehouse>, locationRepo: Repository<StorageLocation>, itemRepo: Repository<InventoryItem>, auditService: AuditService);
    findAllItems(): Promise<InventoryItem[]>;
    generateWarehouseCode(): Promise<string>;
    createWarehouse(data: any, user: User): Promise<Warehouse>;
    generateLocationCode(warehouseId: number, zone: string, aisle: string): Promise<string>;
    receiveItem(data: any, user: User): Promise<InventoryItem>;
    moveItem(id: number, toLocationId: number, user: User): Promise<InventoryItem>;
    findAllWarehouses(): Promise<Warehouse[]>;
    findAllLocations(warehouseId: number): Promise<StorageLocation[]>;
}
