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
    receiveItem(data: any, user: User): Promise<InventoryItem>;
    moveItem(id: number, toLocationId: number, user: User): Promise<InventoryItem>;
    findAllWarehouses(): Promise<Warehouse[]>;
}
