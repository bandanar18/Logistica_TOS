import { Repository } from 'typeorm';
import { Quotation } from './entities/quotation.entity';
import { AuditService } from '../audit/audit.service';
import { Store } from '../stores/entities/store.entity';
import { Service } from '../services/entities/service.entity';
import { MasterCatalogItem } from '../catalogs/entities/master-catalog-item.entity';
import { CommissionRulesService } from '../commission_rules/commission_rules.service';
export declare class QuotationsService {
    private quotationsRepository;
    private storesRepository;
    private servicesRepository;
    private catalogItemRepository;
    private commissionRulesService;
    private auditService;
    constructor(quotationsRepository: Repository<Quotation>, storesRepository: Repository<Store>, servicesRepository: Repository<Service>, catalogItemRepository: Repository<MasterCatalogItem>, commissionRulesService: CommissionRulesService, auditService: AuditService);
    private userId;
    private generateQuotationCode;
    create(createDto: any, client: any): Promise<Quotation>;
    findAllForUser(user: any): Promise<Quotation[]>;
    findOne(id: number): Promise<Quotation>;
    startReview(id: number, user: any): Promise<Quotation>;
    respond(id: number, respondDto: any, user: any): Promise<Quotation>;
    updateStatus(id: number, status: string, user: any): Promise<Quotation>;
}
