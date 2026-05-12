import { Repository } from 'typeorm';
import { Quotation } from './entities/quotation.entity';
import { AuditService } from '../audit/audit.service';
import { Store } from '../stores/entities/store.entity';
import { Service } from '../services/entities/service.entity';
export declare class QuotationsService {
    private quotationsRepository;
    private storesRepository;
    private servicesRepository;
    private auditService;
    constructor(quotationsRepository: Repository<Quotation>, storesRepository: Repository<Store>, servicesRepository: Repository<Service>, auditService: AuditService);
    private userId;
    create(createDto: any, client: any): Promise<Quotation>;
    findAllForUser(user: any): Promise<Quotation[]>;
    findOne(id: number): Promise<Quotation>;
    respond(id: number, respondDto: any, user: any): Promise<Quotation>;
    updateStatus(id: number, status: string, user: any): Promise<Quotation>;
}
