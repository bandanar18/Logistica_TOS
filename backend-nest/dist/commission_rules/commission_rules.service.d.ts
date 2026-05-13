import { Repository } from 'typeorm';
import { CommissionRule } from './entities/commission_rule.entity';
export declare class CommissionRulesService {
    private rulesRepo;
    constructor(rulesRepo: Repository<CommissionRule>);
    findBestRule(category?: string, storeId?: number): Promise<CommissionRule | null>;
    calculateCommission(rule: CommissionRule, amount: number): number;
}
