import { User } from '../../users/entities/user.entity';
export declare class AuditLog {
    id: number;
    auditCode: string;
    user: User;
    userProfile: string;
    module: string;
    action: string;
    entityType: string;
    entityId: string;
    entityCode: string;
    oldValues: any;
    newValues: any;
    changeReason: string;
    severity: string;
    ipAddress: string;
    userAgent: string;
    requestId: string;
    metadata: any;
    createdAt: Date;
}
