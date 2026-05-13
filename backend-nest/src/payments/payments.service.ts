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

  async generatePaymentCode(): Promise<string> {
    const count = await this.paymentsRepository.count();
    const year = new Date().getFullYear();
    return `PAY-${year}-${(count + 1).toString().padStart(5, '0')}`;
  }

  async create(createDto: any, client: any): Promise<Payment> {
    const orderId = createDto.order?.id || createDto.orderId;
    if (!orderId) throw new BadRequestException('Order is required');
    const order = await this.ordersRepository.findOne({ where: { id: +orderId }, relations: ['client'] });
    if (!order) throw new NotFoundException('Order not found');
    if (order.client.id !== this.userId(client)) throw new ForbiddenException('Only the order client can register payments');

    const payment = this.paymentsRepository.create({
      ...createDto,
      paymentCode: await this.generatePaymentCode(),
      order,
      client: { id: this.userId(client) } as User,
      status: createDto.receiptUrl ? 'SUBMITTED' : 'CREATED',
    });
    
    const saved = await this.paymentsRepository.save(payment) as any;
    
    // Update order financial status
    order.financialStatus = saved.status;
    await this.ordersRepository.save(order);

    await this.auditService.log({
      user: { id: this.userId(client) } as User,
      module: 'payments',
      action: 'payment.created',
      entityType: 'payment',
      entityId: saved.id.toString(),
      entityCode: saved.paymentCode,
      severity: 'MEDIUM',
      newValues: { amount: saved.amount, orderId: order.id, code: saved.paymentCode }
    });
    
    return saved;
  }

  async findAllForUser(user: any): Promise<Payment[]> {
    const qb = this.paymentsRepository.createQueryBuilder('p')
      .leftJoinAndSelect('p.client', 'client')
      .leftJoinAndSelect('p.order', 'order')
      .leftJoinAndSelect('order.store', 'store')
      .orderBy('p.createdAt', 'DESC');

    if (user.role === 'admin') {
      // All
    } else if (user.role === 'store') {
      qb.where('store.ownerId = :ownerId', { ownerId: this.userId(user) });
    } else {
      qb.where('client.id = :clientId', { clientId: this.userId(user) });
    }

    return qb.getMany();
  }

  async startReview(id: number, user: any): Promise<Payment> {
    const p = await this.paymentsRepository.findOne({ where: { id }, relations: ['order'] });
    if (!p) throw new NotFoundException('Payment not found');
    if (user.role !== 'admin') throw new ForbiddenException('Only admins/operators can review payments');
    
    const oldStatus = p.status;
    p.status = 'IN_REVIEW';
    const saved = await this.paymentsRepository.save(p);
    
    p.order.financialStatus = 'IN_REVIEW';
    await this.ordersRepository.save(p.order);

    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'payments',
      action: 'payment.in_review',
      entityType: 'payment',
      entityId: id.toString(),
      entityCode: p.paymentCode,
      oldValues: { status: oldStatus },
      newValues: { status: p.status },
      severity: 'MEDIUM'
    });

    return saved;
  }

  async confirm(id: number, user: any): Promise<Payment> {
    const p = await this.paymentsRepository.findOne({ where: { id }, relations: ['client', 'order'] });
    if (!p) throw new NotFoundException('Payment not found');
    if (user.role !== 'admin') throw new ForbiddenException('Only admins can confirm payments');
    
    const oldStatus = p.status;
    p.status = 'CONFIRMED';
    p.confirmedAt = new Date();
    const saved = await this.paymentsRepository.save(p) as any;
    
    p.order.financialStatus = 'CONFIRMED';
    await this.ordersRepository.save(p.order);

    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'payments',
      action: 'payment.confirmed',
      entityType: 'payment',
      entityId: id.toString(),
      entityCode: p.paymentCode,
      oldValues: { status: oldStatus },
      newValues: { status: p.status },
      severity: 'CRITICAL'
    });
    
    return saved;
  }

  async reject(id: number, reason: string, user: any): Promise<Payment> {
    if (!reason) throw new BadRequestException('Rejection reason is required');
    const p = await this.paymentsRepository.findOne({ where: { id }, relations: ['client', 'order'] });
    if (!p) throw new NotFoundException('Payment not found');
    if (user.role !== 'admin') throw new ForbiddenException('Only admins can reject payments');

    const oldStatus = p.status;
    p.status = 'REJECTED';
    p.rejectionReason = reason;
    const saved = await this.paymentsRepository.save(p) as any;
    
    p.order.financialStatus = 'REJECTED';
    await this.ordersRepository.save(p.order);

    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'payments',
      action: 'payment.rejected',
      entityType: 'payment',
      entityId: id.toString(),
      entityCode: p.paymentCode,
      oldValues: { status: oldStatus },
      newValues: { status: p.status, reason },
      severity: 'HIGH',
      changeReason: reason
    });
    return saved;
  }
}
