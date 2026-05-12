import { CatalogsService } from './catalogs.service';
export declare class CatalogsController {
    private readonly catalogsService;
    constructor(catalogsService: CatalogsService);
    findAll(): Promise<import("./entities/master-catalog.entity").MasterCatalog[]>;
    findOne(code: string): Promise<import("./entities/master-catalog.entity").MasterCatalog | null>;
}
