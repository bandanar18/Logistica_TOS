import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private documentsRepository: Repository<Document>,
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private auditService: AuditService,
  ) {}

  private userId(user: any): number {
    return user.sub || user.id;
  }

  async create(data: any, user: any): Promise<Document> {
    const orderId = data.order?.id || data.orderId;
    if (!orderId || !data.type || !data.name || !data.url) throw new BadRequestException('Order, type, name and url are required');
    const order = await this.ordersRepository.findOne({ where: { id: +orderId }, relations: ['client', 'store', 'store.owner'] });
    if (!order) throw new NotFoundException('Order not found');
    const allowed = user.role === 'admin' || order.client.id === this.userId(user) || order.store?.owner?.id === this.userId(user);
    if (!allowed) throw new ForbiddenException('You cannot upload documents for this order');

    const document = this.documentsRepository.create({
      order,
      uploadedBy: { id: this.userId(user) } as User,
      type: data.type,
      name: data.name,
      url: data.url,
      status: 'pending',
    });
    const saved = await this.documentsRepository.save(document) as any;
    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'documents',
      action: 'document.uploaded',
      entityType: 'document',
      entityId: saved.id.toString(),
      details: { orderId: order.id, type: data.type },
    });
    return saved;
  }

  async findAllForUser(user: any): Promise<Document[]> {
    if (user.role === 'admin') {
      return this.documentsRepository.find({ relations: ['order', 'uploadedBy'], order: { createdAt: 'DESC' } });
    }
    if (user.role === 'store') {
      return this.documentsRepository.find({
        where: { order: { store: { owner: { id: this.userId(user) } } } },
        relations: ['order', 'uploadedBy'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.documentsRepository.find({
      where: { order: { client: { id: this.userId(user) } } },
      relations: ['order', 'uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, status: string, user: any): Promise<Document> {
    if (user.role !== 'admin') throw new ForbiddenException('Only admins can validate documents');
    const document = await this.documentsRepository.findOne({ where: { id }, relations: ['order'] });
    if (!document) throw new NotFoundException('Document not found');
    document.status = status;
    return this.documentsRepository.save(document);
  }
}
