import { User } from '../../users/entities/user.entity';
export declare class AuditLog {
    id: number;
    user: User;
    module: string;
    action: string;
    entityType: string;
    entityId: string;
    details: any;
    createdAt: Date;
}
