import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { StoresService } from '../stores/stores.service';
export declare class ServicesService {
    private servicesRepository;
    private storesService;
    constructor(servicesRepository: Repository<Service>, storesService: StoresService);
    create(ownerId: number, serviceData: Partial<Service>): Promise<Service>;
    findByStoreOwner(ownerId: number): Promise<Service[]>;
    searchPublicServices(query: any): Promise<Service[]>;
    findOne(id: number): Promise<Service>;
    update(id: number, ownerId: number, data: Partial<Service>): Promise<Service>;
    remove(id: number, ownerId: number): Promise<void>;
}
