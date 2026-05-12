import { StoresService } from './stores.service';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    createOrUpdate(req: any, storeData: any): Promise<import("./entities/store.entity").Store>;
    findMyStore(req: any): Promise<import("./entities/store.entity").Store>;
    findOnePublic(id: string): Promise<import("./entities/store.entity").Store>;
}
