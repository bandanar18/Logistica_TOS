import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Commission } from './entities/commission.entity';

@Injectable()
export class CommissionsService {
  constructor(
    @InjectRepository(Commission) private commissionsRepository: Repository<Commission>,
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Commission[]> {
    return this.commissionsRepository.find({ 
      relations: ['order', 'store', 'rule'], 
      order: { createdAt: 'DESC' } 
    });
  }

  async createForOrder(order: Order, rate: number, amount: number, ruleId?: number): Promise<Commission> {
    const commission = this.commissionsRepository.create({
      order,
      store: order.store,
      baseAmount: order.subtotalAmount,
      commissionType: 'PERCENTAGE',
      rate,
      amount,
      rule: ruleId ? { id: ruleId } as any : undefined,
      status: 'CALCULATED',
    });
    return this.commissionsRepository.save(commission);
  }

  async updateStatus(id: number, status: string): Promise<Commission> {
    const validStatuses = ['CALCULATED', 'PENDING', 'CONFIRMED', 'CANCELLED'];
    if (!validStatuses.includes(status)) throw new BadRequestException('Invalid commission status');
    
    const commission = await this.commissionsRepository.findOne({ where: { id }, relations: ['order', 'store'] });
    if (!commission) throw new NotFoundException('Commission not found');
    
    commission.status = status;
    if (status === 'CONFIRMED') commission.confirmedAt = new Date();
    
    return this.commissionsRepository.save(commission);
  }
}
