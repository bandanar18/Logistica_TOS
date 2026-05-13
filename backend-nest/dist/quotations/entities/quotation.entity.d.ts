import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { Service } from '../../services/entities/service.entity';
import { MasterCatalogItem } from '../../catalogs/entities/master-catalog-item.entity';
export declare class Quotation {
    id: number;
    quotationCode: string;
    client: User;
    store: Store;
    service: Service;
    quantity: number;
    unitMeasure: MasterCatalogItem;
    subtotalAmount: number;
    taxAmount: number;
    commissionAmount: number;
    totalAmount: number;
    currency: MasterCatalogItem;
    notes: string;
    responseNotes: string;
    status: string;
    respondedAt: Date;
    approvedAt: Date;
    rejectedAt: Date;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
