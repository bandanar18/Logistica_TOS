import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../users/entities/user.entity';
export declare class AuditService {
    private auditRepository;
    constructor(auditRepository: Repository<AuditLog>);
    log(data: {
        user?: User;
        userProfile?: string;
        module: string;
        action: string;
        entityType?: string;
        entityId?: string;
        entityCode?: string;
        oldValues?: any;
        newValues?: any;
        changeReason?: string;
        severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        ipAddress?: string;
        userAgent?: string;
        requestId?: string;
        metadata?: any;
    }): Promise<AuditLog>;
    findAll(filters?: any): Promise<AuditLog[]>;
    findByEntity(type: string, id: string): Promise<AuditLog[]>;
}
