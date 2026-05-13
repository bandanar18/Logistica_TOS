import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommissionRule } from './entities/commission_rule.entity';

@Injectable()
export class CommissionRulesService {
  constructor(
    @InjectRepository(CommissionRule)
    private rulesRepo: Repository<CommissionRule>,
  ) {}

  async findBestRule(category?: string, storeId?: number): Promise<CommissionRule | null> {
    const rules = await this.rulesRepo.find({
      where: { status: 'ACTIVE' },
      order: { priority: 'DESC' },
      relations: ['store'],
    });

    // Try store + category
    if (storeId && category) {
      const match = rules.find(r => r.store?.id === storeId && r.serviceCategory === category);
      if (match) return match;
    }

    // Try store
    if (storeId) {
      const match = rules.find(r => r.store?.id === storeId && !r.serviceCategory);
      if (match) return match;
    }

    // Try category
    if (category) {
      const match = rules.find(r => r.serviceCategory === category && !r.store);
      if (match) return match;
    }

    // Fallback to global
    return rules.find(r => !r.store && !r.serviceCategory) || null;
  }

  calculateCommission(rule: CommissionRule, amount: number): number {
    if (rule.commissionType === 'PERCENTAGE') {
      return Number(amount) * (Number(rule.percentage) / 100);
    }
    if (rule.commissionType === 'FIXED_AMOUNT') {
      return Number(rule.fixedAmount);
    }
    return 0;
  }
}
