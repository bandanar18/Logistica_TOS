import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
export declare class StoresService {
    private storesRepository;
    constructor(storesRepository: Repository<Store>);
    createOrUpdate(ownerId: number, storeData: Partial<Store>): Promise<Store>;
    findByOwner(ownerId: number): Promise<Store>;
    findAll(): Promise<Store[]>;
    findOnePublic(id: number): Promise<Store>;
}
