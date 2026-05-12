import { StorageService } from './storage.service';
export declare class StorageController {
    private readonly storageService;
    constructor(storageService: StorageService);
    findAllItems(): Promise<import("./entities/inventory-item.entity").InventoryItem[]>;
    receiveItem(data: any, req: any): Promise<import("./entities/inventory-item.entity").InventoryItem>;
    moveItem(id: string, moveDto: {
        toLocationId: number;
    }, req: any): Promise<import("./entities/inventory-item.entity").InventoryItem>;
    findAllWarehouses(): Promise<import("./entities/warehouse.entity").Warehouse[]>;
}
