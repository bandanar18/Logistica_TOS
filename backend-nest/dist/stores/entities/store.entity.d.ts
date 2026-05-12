import { User } from '../../users/entities/user.entity';
export declare class Store {
    id: number;
    legalName: string;
    taxId: string;
    basePort: string;
    description: string;
    brandColor: string;
    logoUrl: string;
    status: string;
    averageRating: number;
    reviewCount: number;
    owner: User;
    createdAt: Date;
    updatedAt: Date;
}
