import { Role } from '../../roles/entities/role.entity';
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    isActive: boolean;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
