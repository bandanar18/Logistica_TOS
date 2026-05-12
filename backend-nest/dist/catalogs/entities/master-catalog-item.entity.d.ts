import { MasterCatalog } from './master-catalog.entity';
export declare class MasterCatalogItem {
    id: number;
    code: string;
    name: string;
    description: string;
    status: string;
    catalog: MasterCatalog;
    createdAt: Date;
    updatedAt: Date;
}
