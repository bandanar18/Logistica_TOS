import { ForbiddenException, Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { TransportService } from '../transport/transport.service';
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
    @Inject(forwardRef(() => TransportService))
    private transportService: TransportService,
    private auditService: AuditService,
  ) {}

  private userId(user: any): number {
    return user.sub || user.id;
  }

  private async generateOrderCode(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.ordersRepository.count();
    return `ORD-${year}-${(count + 1).toString().padStart(4, '0')}`;
  }

  async createFromQuotation(quotation: Quotation): Promise<Order> {
    const existing = await this.ordersRepository.findOne({ where: { quotation: { id: quotation.id } } });
    if (existing) return existing;

    const order = this.ordersRepository.create({
      orderCode: await this.generateOrderCode(),
      quotation,
      client: quotation.client,
      store: quotation.store,
      service: quotation.service,
      subtotalAmount: quotation.subtotalAmount,
      taxAmount: quotation.taxAmount,
      commissionAmount: quotation.commissionAmount,
      totalAmount: quotation.totalAmount,
      providerNetAmount: (quotation.subtotalAmount || 0) - (quotation.commissionAmount || 0),
      currency: quotation.currency,
      operationalStatus: 'CREATED',
      financialStatus: 'UNPAID',
      documentStatus: quotation.status === 'CONVERTED' ? 'VALIDATED' : 'PENDING',
    });

    const saved = await this.ordersRepository.save(order);
    await this.auditService.log({
      module: 'orders',
      action: 'order.created',
      entityType: 'order',
      entityId: saved.id.toString(),
      entityCode: saved.orderCode,
      severity: 'HIGH',
      newValues: { quotationCode: quotation.quotationCode, totalAmount: saved.totalAmount }
    });
    return saved;
  }

  async findAllForUser(user: any): Promise<Order[]> {
    const qb = this.ordersRepository.createQueryBuilder('o')
      .leftJoinAndSelect('o.client', 'client')
      .leftJoinAndSelect('o.store', 'store')
      .leftJoinAndSelect('o.service', 'service')
      .leftJoinAndSelect('o.quotation', 'quotation')
      .leftJoinAndSelect('o.currency', 'currency')
      .orderBy('o.createdAt', 'DESC');

    if (user.role === 'admin') {
      // All
    } else if (user.role === 'store') {
      qb.where('store.ownerId = :ownerId', { ownerId: this.userId(user) });
    } else {
      qb.where('client.id = :clientId', { clientId: this.userId(user) });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Order> {
    const o = await this.ordersRepository.findOne({
      where: { id },
      relations: ['client', 'store', 'store.owner', 'service', 'quotation', 'currency'],
    });
    if (!o) throw new NotFoundException('Order not found');
    return o;
  }

  async start(id: number, user: any): Promise<Order> {
    const o = await this.findOne(id);
    if (user.role !== 'admin' && o.store?.owner?.id !== this.userId(user)) {
      throw new ForbiddenException('Only the store owner can start this order');
    }
    if (o.operationalStatus !== 'CREATED') throw new BadRequestException('Order already started or invalid status');
    
    const oldStatus = o.operationalStatus;
    o.operationalStatus = 'IN_PROCESS';
    o.startedAt = new Date();
    
    const saved = await this.ordersRepository.save(o);

    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'orders',
      action: 'order.started',
      entityType: 'order',
      entityId: id.toString(),
      entityCode: saved.orderCode,
      oldValues: { status: oldStatus },
      newValues: { status: saved.operationalStatus },
      severity: 'MEDIUM'
    });

    // If it's a transport order, create a trip
    if (o.service?.category?.itemCode === 'TRANSPORT_SERVICE') {
       await this.transportService.createTrip({
          order: saved,
          carrier: o.store,
          tripType: 'STANDARD',
          originName: 'PORT', // Default values or from metadata
          originAddress: 'PORT AREA',
          destinationName: 'WAREHOUSE',
          destinationAddress: 'CLIENT AREA',
          status: 'CREATED'
       }, user as any);
    }

    return saved;
  }

  async updateStatus(id: number, status: string, user: any): Promise<Order> {
    const o = await this.findOne(id);
    if (user.role !== 'admin' && o.store?.owner?.id !== this.userId(user)) {
      throw new ForbiddenException('Only authorized users can update this order');
    }

    const oldStatus = o.operationalStatus;
    // Operational transitions
    const validOps = ['IN_PROCESS', 'EXECUTING', 'ON_HOLD', 'CLOSED', 'CANCELLED'];
    if (validOps.includes(status)) {
      o.operationalStatus = status;
      if (status === 'CLOSED') o.closedAt = new Date();
      if (status === 'CANCELLED') o.cancelledAt = new Date();
    }

    const saved = await this.ordersRepository.save(o);
    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'orders',
      action: 'order.status_changed',
      entityType: 'order',
      entityId: id.toString(),
      entityCode: saved.orderCode,
      oldValues: { status: oldStatus },
      newValues: { status: saved.operationalStatus },
      severity: (status === 'CLOSED' || status === 'CANCELLED') ? 'CRITICAL' : 'HIGH'
    });
    return saved;
  }
}
