import { Injectable } from '@nestjs/common';
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
    const orders = await this.ordersRepository.find({ relations: ['store'] });
    for (const order of orders) {
      const existing = await this.commissionsRepository.findOne({ where: { order: { id: order.id } } });
      if (!existing) {
        await this.commissionsRepository.save(this.commissionsRepository.create({
          order,
          store: order.store,
          rate: 10,
          amount: Number(order.finalPrice) * 0.1,
          status: order.status === 'completed' ? 'earned' : 'pending',
        }));
      }
    }
    return this.commissionsRepository.find({ relations: ['order', 'store'], order: { createdAt: 'DESC' } });
  }
}
