import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MasterCatalog } from './entities/master-catalog.entity';
import { MasterCatalogItem } from './entities/master-catalog-item.entity';
export declare class CatalogsService implements OnModuleInit {
    private catalogsRepository;
    private itemsRepository;
    constructor(catalogsRepository: Repository<MasterCatalog>, itemsRepository: Repository<MasterCatalogItem>);
    onModuleInit(): Promise<void>;
    findAll(): Promise<MasterCatalog[]>;
    findOne(code: string): Promise<MasterCatalog | null>;
}
