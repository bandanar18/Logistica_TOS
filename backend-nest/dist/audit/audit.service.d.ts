import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../users/entities/user.entity';
export declare class AuditService {
    private auditRepository;
    constructor(auditRepository: Repository<AuditLog>);
    log(data: {
        user?: User;
        module: string;
        action: string;
        entityType?: string;
        entityId?: string;
        details?: any;
    }): Promise<AuditLog>;
    findAll(): Promise<AuditLog[]>;
}
