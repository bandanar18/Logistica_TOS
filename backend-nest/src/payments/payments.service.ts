import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { User } from '../users/entities/user.entity';
import { AuditService } from '../audit/audit.service';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private auditService: AuditService,
  ) {}

  private userId(user: any): number {
    return user.sub || user.id;
  }

  async create(createDto: any, client: any): Promise<Payment> {
    const orderId = createDto.order?.id || createDto.orderId;
    if (!orderId) throw new BadRequestException('Order is required');
    const order = await this.ordersRepository.findOne({ where: { id: +orderId }, relations: ['client'] });
    if (!order) throw new NotFoundException('Order not found');
    if (order.client.id !== this.userId(client)) throw new ForbiddenException('Only the order client can register payments');
    const existingPayments = await this.paymentsRepository.find({ where: { order: { id: order.id } } });
    const paidOrPending = existingPayments
      .filter((payment) => payment.status !== 'rejected')
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    const remaining = Number(order.finalPrice) - paidOrPending;
    if (Number(createDto.amount) <= 0 || Number(createDto.amount) > remaining) {
      throw new BadRequestException('Payment amount is invalid for this order');
    }

    const payment = this.paymentsRepository.create({
      ...createDto,
      order,
      client: { id: this.userId(client) } as User,
      status: 'pending',
    });
    const saved = await this.paymentsRepository.save(payment) as any;
    
    await this.auditService.log({
      user: { id: this.userId(client) } as User,
      module: 'payments',
      action: 'payment.created',
      entityType: 'payment',
      entityId: saved.id.toString(),
      details: { amount: saved.amount, orderId: createDto.order?.id }
    });
    
    return saved;
  }

  async findAllForUser(user: any): Promise<Payment[]> {
    if (user.role === 'admin' || user.role?.name === 'admin') {
      return this.paymentsRepository.find({ relations: ['client', 'order'], order: { createdAt: 'DESC' } });
    }
    if (user.role === 'store' || user.role?.name === 'store') {
      return this.paymentsRepository.find({
        where: { order: { store: { owner: { id: this.userId(user) } } } },
        relations: ['client', 'order', 'order.store'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.paymentsRepository.find({
      where: { client: { id: this.userId(user) } },
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }

  async confirm(id: number, user: any): Promise<Payment> {
    const p = await this.paymentsRepository.findOne({ where: { id }, relations: ['client', 'order'] });
    if (!p) throw new NotFoundException('Payment not found');
    if (user.role !== 'admin') throw new ForbiddenException('Only admins can confirm payments');
    if (p.status !== 'pending') throw new BadRequestException('Only pending payments can be confirmed');
    
    p.status = 'confirmed';
    p.confirmedAt = new Date();
    const saved = await this.paymentsRepository.save(p) as any;
    
    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'payments',
      action: 'payment.confirmed',
      entityType: 'payment',
      entityId: id.toString(),
      details: { previousStatus: 'pending' }
    });
    
    return saved;
  }

  async reject(id: number, reason: string, user: any): Promise<Payment> {
    const p = await this.paymentsRepository.findOne({ where: { id }, relations: ['client', 'order'] });
    if (!p) throw new NotFoundException('Payment not found');
    if (user.role !== 'admin') throw new ForbiddenException('Only admins can reject payments');
    if (p.status !== 'pending') throw new BadRequestException('Only pending payments can be rejected');

    p.status = 'rejected';
    const saved = await this.paymentsRepository.save(p) as any;
    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'payments',
      action: 'payment.rejected',
      entityType: 'payment',
      entityId: id.toString(),
      details: { reason }
    });
    return saved;
  }
}
