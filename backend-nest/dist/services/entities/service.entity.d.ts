import { Store } from '../../stores/entities/store.entity';
import { MasterCatalogItem } from '../../catalogs/entities/master-catalog-item.entity';
export declare class Service {
    id: number;
    name: string;
    code: string;
    description: string;
    basePrice: number;
    billingUnit: string;
    scope: string;
    exclusions: string;
    slaHours: number;
    requiredDocuments: string[];
    currencyCode: string;
    status: string;
    store: Store;
    category: MasterCatalogItem;
    createdAt: Date;
    updatedAt: Date;
}
