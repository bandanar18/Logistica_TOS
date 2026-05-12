import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(): Promise<import("./entities/audit-log.entity").AuditLog[]>;
    findByEntity(type: string, id: string): Promise<import("./entities/audit-log.entity").AuditLog[]>;
}
