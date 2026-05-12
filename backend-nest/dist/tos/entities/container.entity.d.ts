import { Yard } from './yard.entity';
export declare class Container {
    id: number;
    containerNumber: string;
    type: string;
    loadStatus: string;
    yard: Yard;
    locationInYard: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
