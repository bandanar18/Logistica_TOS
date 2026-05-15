import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation } from './entities/quotation.entity';
import { User } from '../users/entities/user.entity';
import { AuditService } from '../audit/audit.service';
import { Store } from '../stores/entities/store.entity';
import { Service } from '../services/entities/service.entity';
import { MasterCatalogItem } from '../catalogs/entities/master-catalog-item.entity';
import { CommissionRulesService } from '../commission_rules/commission_rules.service';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Quotation)
    private quotationsRepository: Repository<Quotation>,
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(MasterCatalogItem)
    private catalogItemRepository: Repository<MasterCatalogItem>,
    private commissionRulesService: CommissionRulesService,
    private auditService: AuditService,
  ) {}

  private userId(user: any): number {
    return user.sub || user.id;
  }

  private async generateQuotationCode(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.quotationsRepository.count();
    return `COT-${year}-${(count + 1).toString().padStart(4, '0')}`;
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

    const unitMeasure = createDto.unitMeasureId 
      ? await this.catalogItemRepository.findOneBy({ id: createDto.unitMeasureId })
      : undefined;

    const quotation = this.quotationsRepository.create({
      quotationCode: await this.generateQuotationCode(),
      service,
      store,
      quantity: createDto.quantity || 1,
      unitMeasure: unitMeasure as any,
      notes: createDto.notes,
      client: { id: this.userId(client) } as User,
      status: 'REQUESTED',
    });

    const saved = await this.quotationsRepository.save(quotation) as any;
    await this.auditService.log({
      user: { id: this.userId(client) } as User,
      module: 'quotations',
      action: 'quotation.created',
      entityType: 'quotation',
      entityId: saved.id.toString(),
      entityCode: saved.quotationCode,
      severity: 'MEDIUM',
      newValues: { serviceId, storeId }
    });
    return saved;
  }

  async findAllForUser(user: any): Promise<Quotation[]> {
    const qb = this.quotationsRepository.createQueryBuilder('q')
      .leftJoinAndSelect('q.client', 'client')
      .leftJoinAndSelect('q.store', 'store')
      .leftJoinAndSelect('store.owner', 'owner')
      .leftJoinAndSelect('q.service', 'service')
      .leftJoinAndSelect('q.unitMeasure', 'unitMeasure')
      .orderBy('q.createdAt', 'DESC');

    if (user.role === 'admin') {
      // Return all
    } else if (user.role === 'store') {
      qb.where('owner.id = :ownerId', { ownerId: this.userId(user) });
    } else {
      qb.where('client.id = :clientId', { clientId: this.userId(user) });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Quotation> {
    const q = await this.quotationsRepository.findOne({
      where: { id },
      relations: ['client', 'store', 'store.owner', 'service', 'unitMeasure', 'currency'],
    });
    if (!q) throw new NotFoundException('Quotation not found');
    return q;
  }

  async startReview(id: number, user: any): Promise<Quotation> {
    const q = await this.findOne(id);
    if (user.role !== 'admin' && q.store?.owner?.id !== this.userId(user)) {
      throw new ForbiddenException('Only the store owner can update this quotation');
    }
    if (q.status !== 'REQUESTED') throw new BadRequestException('Can only start review for REQUESTED quotations');
    
    const oldStatus = q.status;
    q.status = 'IN_REVIEW';
    const saved = await this.quotationsRepository.save(q);

    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'quotations',
      action: 'quotation.in_review',
      entityType: 'quotation',
      entityId: id.toString(),
      entityCode: q.quotationCode,
      oldValues: { status: oldStatus },
      newValues: { status: q.status },
      severity: 'LOW'
    });
    return saved;
  }

  async respond(id: number, respondDto: any, user: any): Promise<Quotation> {
    const q = await this.findOne(id);
    if (user.role !== 'admin' && q.store?.owner?.id !== this.userId(user)) {
      throw new ForbiddenException('Only the store owner can respond to this quotation');
    }
    if (!['REQUESTED', 'IN_REVIEW'].includes(q.status)) {
      throw new BadRequestException('Only requested or in-review quotations can be responded');
    }
    
    const subtotal = Number(respondDto.price);
    if (isNaN(subtotal) || subtotal <= 0) throw new BadRequestException('A valid price is required');
    
    // Dynamic commission calculation
    const category = q.service?.category?.code;
    const rule = await this.commissionRulesService.findBestRule(category, q.store?.id);
    
    const oldValues = { status: q.status, price: q.subtotalAmount };
    q.subtotalAmount = subtotal;
    q.commissionAmount = rule ? this.commissionRulesService.calculateCommission(rule, subtotal) : subtotal * 0.10; 
    q.taxAmount = subtotal * 0.16; // 16% tax (could also be dynamic later)
    q.totalAmount = subtotal + q.taxAmount;
    
    if (respondDto.currencyId) {
       q.currency = { id: respondDto.currencyId } as any;
    }

    q.responseNotes = respondDto.responseNotes;
    q.status = 'RESPONDED';
    q.respondedAt = new Date();
    
    // Default expiration: 7 days
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    q.expiresAt = expires;

    const saved = await this.quotationsRepository.save(q);
    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'quotations',
      action: 'quotation.responded',
      entityType: 'quotation',
      entityId: id.toString(),
      entityCode: q.quotationCode,
      oldValues,
      newValues: { status: q.status, total: q.totalAmount, ruleApplied: rule?.ruleCode || 'DEFAULT_10' },
      severity: 'HIGH'
    });
    return saved;
  }

  async updateStatus(id: number, status: string, user: any): Promise<Quotation> {
    const q = await this.findOne(id);
    const validStatuses = ['APPROVED', 'REJECTED', 'CONVERTED', 'CANCELLED'];
    if (!validStatuses.includes(status)) throw new BadRequestException('Invalid status');

    if (q.client.id !== this.userId(user) && user.role !== 'admin') {
       throw new ForbiddenException('Only the client can update this status');
    }

    const oldStatus = q.status;
    if (status === 'APPROVED') {
      if (q.status !== 'RESPONDED') throw new BadRequestException('Only responded quotations can be approved');
      if (q.expiresAt && new Date() > q.expiresAt) throw new BadRequestException('Quotation has expired');
      q.approvedAt = new Date();
    }

    if (status === 'REJECTED') {
      q.rejectedAt = new Date();
    }

    q.status = status;
    const saved = await this.quotationsRepository.save(q);
    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'quotations',
      action: 'quotation.status_changed',
      entityType: 'quotation',
      entityId: id.toString(),
      entityCode: q.quotationCode,
      oldValues: { status: oldStatus },
      newValues: { status: saved.status },
      severity: status === 'APPROVED' ? 'HIGH' : 'MEDIUM'
    });
    return saved;
  }
}
