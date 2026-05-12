import { ServicesService } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(req: any, serviceData: any): Promise<import("./entities/service.entity").Service>;
    findStoreServices(req: any): Promise<import("./entities/service.entity").Service[]>;
    search(query: any): Promise<import("./entities/service.entity").Service[]>;
    findOne(id: string): Promise<import("./entities/service.entity").Service>;
    update(id: string, req: any, data: any): Promise<import("./entities/service.entity").Service>;
    remove(id: string, req: any): Promise<void>;
}
