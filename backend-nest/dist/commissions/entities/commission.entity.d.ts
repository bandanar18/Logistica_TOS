import { Order } from '../../orders/entities/order.entity';
import { Store } from '../../stores/entities/store.entity';
import { CommissionRule } from '../../commission_rules/entities/commission_rule.entity';
export declare class Commission {
    id: number;
    commissionCode: string;
    order: Order;
    store: Store;
    rule: CommissionRule;
    baseAmount: number;
    commissionType: string;
    rate: number;
    amount: number;
    status: string;
    confirmedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
