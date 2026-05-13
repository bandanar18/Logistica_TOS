import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { Service } from '../../services/entities/service.entity';
import { Quotation } from '../../quotations/entities/quotation.entity';
import { MasterCatalogItem } from '../../catalogs/entities/master-catalog-item.entity';
export declare class Order {
    id: number;
    orderCode: string;
    quotation: Quotation;
    client: User;
    store: Store;
    service: Service;
    subtotalAmount: number;
    taxAmount: number;
    commissionAmount: number;
    totalAmount: number;
    providerNetAmount: number;
    currency: MasterCatalogItem;
    operationalStatus: string;
    financialStatus: string;
    documentStatus: string;
    startedAt: Date;
    closedAt: Date;
    cancelledAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
