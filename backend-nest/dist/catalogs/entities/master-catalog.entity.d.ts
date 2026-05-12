import { MasterCatalogItem } from './master-catalog-item.entity';
export declare class MasterCatalog {
    id: number;
    code: string;
    name: string;
    description: string;
    status: string;
    items: MasterCatalogItem[];
    createdAt: Date;
    updatedAt: Date;
}
