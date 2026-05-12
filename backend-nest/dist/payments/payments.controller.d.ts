import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createDto: any, req: any): Promise<import("./entities/payment.entity").Payment>;
    findAll(req: any): Promise<import("./entities/payment.entity").Payment[]>;
    confirm(id: string, req: any): Promise<import("./entities/payment.entity").Payment>;
    reject(id: string, reason: string, req: any): Promise<import("./entities/payment.entity").Payment>;
}
