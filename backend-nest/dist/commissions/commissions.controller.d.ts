import { CommissionsService } from './commissions.service';
export declare class CommissionsController {
    private readonly commissionsService;
    constructor(commissionsService: CommissionsService);
    findAll(): Promise<import("./entities/commission.entity").Commission[]>;
    updateStatus(id: string, status: string): Promise<import("./entities/commission.entity").Commission>;
}
