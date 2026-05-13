import { Store } from '../../stores/entities/store.entity';
export declare class Driver {
    id: number;
    driverCode: string;
    store: Store;
    firstName: string;
    lastName: string;
    phone: string;
    licenseNumber: string;
    licenseExpiration: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
