import { MasterCatalogItem } from '../../catalogs/entities/master-catalog-item.entity';
export declare class Warehouse {
    id: number;
    name: string;
    code: string;
    type: MasterCatalogItem;
    address: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
