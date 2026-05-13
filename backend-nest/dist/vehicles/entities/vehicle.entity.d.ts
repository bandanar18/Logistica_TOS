import { Store } from '../../stores/entities/store.entity';
export declare class Vehicle {
    id: number;
    vehicleCode: string;
    store: Store;
    vehicleType: string;
    plateNumber: string;
    capacityWeight: number;
    capacityVolume: number;
    status: string;
    insuranceExpiration: Date;
    createdAt: Date;
    updatedAt: Date;
}
