import { ServicesService } from '../services/services.service';
import { CatalogsService } from '../catalogs/catalogs.service';
import { StoresService } from '../stores/stores.service';
export declare class SearchController {
    private readonly servicesService;
    private readonly catalogsService;
    private readonly storesService;
    constructor(servicesService: ServicesService, catalogsService: CatalogsService, storesService: StoresService);
    searchServices(query: any): Promise<import("../services/entities/service.entity").Service[]>;
    searchCategories(): Promise<any>;
    searchStores(query: any): Promise<import("../stores/entities/store.entity").Store[]>;
}
