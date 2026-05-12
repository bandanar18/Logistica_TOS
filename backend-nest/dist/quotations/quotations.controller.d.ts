import { QuotationsService } from './quotations.service';
import { OrdersService } from '../orders/orders.service';
export declare class QuotationsController {
    private readonly quotationsService;
    private readonly ordersService;
    constructor(quotationsService: QuotationsService, ordersService: OrdersService);
    create(createDto: any, req: any): Promise<import("./entities/quotation.entity").Quotation>;
    findAll(req: any): Promise<import("./entities/quotation.entity").Quotation[]>;
    findOne(id: string): Promise<import("./entities/quotation.entity").Quotation>;
    respond(id: string, respondDto: any, req: any): Promise<import("./entities/quotation.entity").Quotation>;
    updateStatus(id: string, status: string, req: any): Promise<import("./entities/quotation.entity").Quotation>;
    convertToOrder(id: string, req: any): Promise<import("../orders/entities/order.entity").Order>;
}
