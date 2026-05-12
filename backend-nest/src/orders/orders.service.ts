import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { AuditService } from '../audit/audit.service';
import { Payment } from '../payments/entities/payment.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private auditService: AuditService,
  ) {}

  async createFromQuotation(quotation: Quotation): Promise<Order> {
    const existing = await this.ordersRepository.findOne({ where: { quotation: { id: quotation.id } } });
    if (existing) return existing;
    const order = this.ordersRepository.create({
      quotation,
      client: quotation.client,
      store: quotation.store,
      service: quotation.service,
      finalPrice: quotation.price,
      status: 'pending',
    });
    const saved = await this.ordersRepository.save(order) as any;
    await this.auditService.log({
      module: 'orders',
      action: 'order.created',
      entityType: 'order',
      entityId: saved.id.toString(),
      details: { quotationId: quotation.id }
    });
    return saved;
  }

  private userId(user: any): number {
    return user.sub || user.id;
  }

  async findAllForUser(user: any): Promise<Order[]> {
    if (user.role === 'admin' || user.role?.name === 'admin') {
      return this.ordersRepository.find({
        relations: ['client', 'service', 'quotation', 'store'],
        order: { createdAt: 'DESC' },
      });
    }
    if (user.role === 'store' || user.role?.name === 'store') {
       return this.ordersRepository.find({
        where: { store: { owner: { id: this.userId(user) } } },
        relations: ['client', 'service', 'quotation', 'store'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.ordersRepository.find({
      where: { client: { id: this.userId(user) } },
      relations: ['store', 'service', 'quotation'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const o = await this.ordersRepository.findOne({
      where: { id },
      relations: ['client', 'store', 'store.owner', 'service', 'quotation'],
    });
    if (!o) throw new NotFoundException('Order not found');
    return o;
  }

  async updateStatus(id: number, status: string, user: any): Promise<Order> {
    const o = await this.findOne(id);
    if (user.role !== 'admin' && o.store?.owner?.id !== this.userId(user)) {
      throw new ForbiddenException('Only the store owner can update this order');
    }
    if (status === 'in_progress') {
      const confirmedPayments = await this.paymentsRepository.find({ where: { order: { id }, status: 'confirmed' } });
      const paid = confirmedPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
      if (paid < Number(o.finalPrice)) {
        throw new ForbiddenException('Order cannot start until payment is fully confirmed');
      }
    }
    o.status = status;
    if (status === 'completed') {
      o.completedAt = new Date();
    }
    const saved = await this.ordersRepository.save(o) as any;
    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'orders',
      action: 'order.status_changed',
      entityType: 'order',
      entityId: id.toString(),
      details: { status }
    });
    return saved;
  }
}
