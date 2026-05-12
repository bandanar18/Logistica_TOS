import { Repository } from 'typeorm';
import { Inspection } from './entities/inspection.entity';
import { InspectionResult } from './entities/inspection-result.entity';
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';
export declare class InspectionsService {
    private inspectionRepo;
    private resultRepo;
    private auditService;
    constructor(inspectionRepo: Repository<Inspection>, resultRepo: Repository<InspectionResult>, auditService: AuditService);
    findAll(): Promise<Inspection[]>;
    create(data: any, user: User): Promise<Inspection>;
    saveResult(id: number, resultData: any, user: User): Promise<InspectionResult>;
}
