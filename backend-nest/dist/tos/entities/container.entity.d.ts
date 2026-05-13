import { Yard } from './yard.entity';
import { MasterCatalogItem } from '../../catalogs/entities/master-catalog-item.entity';
export declare class Container {
    id: number;
    containerNumber: string;
    type: MasterCatalogItem;
    loadStatus: MasterCatalogItem;
    yard: Yard;
    locationInYard: string;
    status: MasterCatalogItem;
    createdAt: Date;
    updatedAt: Date;
}
