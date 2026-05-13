import { Store } from '../../stores/entities/store.entity';
export declare class CommissionRule {
    id: number;
    ruleCode: string;
    ruleName: string;
    commissionType: string;
    percentage: number;
    fixedAmount: number;
    serviceCategory: string;
    store: Store;
    priority: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
