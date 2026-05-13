import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation } from './entities/quotation.entity';
import { User } from '../users/entities/user.entity';
import { AuditService } from '../audit/audit.service';
import { Store } from '../stores/entities/store.entity';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Quotation)
    private quotationsRepository: Repository<Quotation>,
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    private auditService: AuditService,
  ) {}

  private userId(user: any): number {
    return user.sub || user.id;
  }

  async create(createDto: any, client: any): Promise<Quotation> {
    const serviceId = createDto.service?.id || createDto.serviceId;
    const storeId = createDto.store?.id || createDto.storeId;
    if (!serviceId || !storeId) throw new BadRequestException('Service and store are required');

    const [service, store] = await Promise.all([
      this.servicesRepository.findOne({ where: { id: +serviceId }, relations: ['store'] }),
      this.storesRepository.findOne({ where: { id: +storeId } }),
    ]);
    if (!service) throw new NotFoundException('Service not found');
    if (!store || store.status !== 'approved') throw new NotFoundException('Store not found or not approved');
    if (service.store?.id !== store.id) throw new BadRequestException('Service does not belong to selected store');

    const quotation = this.quotationsRepository.create({
      service,
      store,
      notes: createDto.notes,
      client: { id: this.userId(client) } as User,
      status: 'pending',
    });
    const saved = await this.quotationsRepository.save(quotation) as any;
    await this.auditService.log({
      user: { id: this.userId(client) } as User,
      module: 'quotations',
      action: 'quotation.created',
      entityType: 'quotation',
      entityId: saved.id.toString(),
      details: { serviceId: createDto.service?.id }
    });
    return saved;
  }

  async findAllForUser(user: any): Promise<Quotation[]> {
    if (user.role === 'admin') {
      return this.quotationsRepository.find({
        relations: ['client', 'service', 'store'],
        order: { createdAt: 'DESC' }
      });
    }
    const userWithRole = await this.quotationsRepository.manager.getRepository(User).findOne({
      where: { id: this.userId(user) },
      relations: ['role']
    });

    if (userWithRole?.role?.name === 'store' || user.role === 'store') {
      return this.quotationsRepository.find({
        where: { store: { owner: { id: this.userId(user) } } },
        relations: ['client', 'service', 'store'],
        order: { createdAt: 'DESC' }
      });
    }
    return this.quotationsRepository.find({
      where: { client: { id: this.userId(user) } },
      relations: ['store', 'service'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Quotation> {
    const q = await this.quotationsRepository.findOne({
      where: { id },
      relations: ['client', 'store', 'store.owner', 'service'],
    });
    if (!q) throw new NotFoundException('Quotation not found');
    return q;
  }

  async respond(id: number, respondDto: any, user: any): Promise<Quotation> {
    const q = await this.findOne(id);
    if (user.role !== 'admin' && q.store?.owner?.id !== this.userId(user)) {
      throw new ForbiddenException('Only the store owner can respond to this quotation');
    }
    if (q.status !== 'pending') throw new BadRequestException('Only pending quotations can be responded');
    if (!respondDto.price || Number(respondDto.price) <= 0) throw new BadRequestException('A valid price is required');
    
    q.price = respondDto.price;
    q.responseNotes = respondDto.responseNotes;
    q.status = 'responded';
    q.respondedAt = new Date();
    const saved = await this.quotationsRepository.save(q) as any;
    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'quotations',
      action: 'quotation.responded',
      entityType: 'quotation',
      entityId: id.toString(),
      details: { price: q.price }
    });
    return saved;
  }

  async updateStatus(id: number, status: string, user: any): Promise<Quotation> {
    const q = await this.findOne(id);
    if (!['approved', 'rejected', 'order_created'].includes(status)) throw new BadRequestException('Invalid status transition');
    if (q.client.id !== this.userId(user) && user.role !== 'admin') {
       throw new ForbiddenException('Only the client can approve or reject the quotation');
    }
    if (status === 'approved' && ['approved', 'order_created'].includes(q.status)) {
      return q;
    }
    if (status === 'rejected' && q.status === 'rejected') {
      return q;
    }
    if (status === 'order_created' && q.status === 'order_created') {
      return q;
    }
    if ((status === 'approved' || status === 'rejected') && q.status !== 'responded') {
      throw new BadRequestException('Only responded quotations can be approved or rejected');
    }
    q.status = status;
    const saved = await this.quotationsRepository.save(q) as any;
    await this.auditService.log({
      user,
      module: 'quotations',
      action: 'quotation.status_changed',
      entityType: 'quotation',
      entityId: id.toString(),
      details: { status }
    });
    return saved;
  }
}
