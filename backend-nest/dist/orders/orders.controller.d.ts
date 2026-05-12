import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(req: any): Promise<import("./entities/order.entity").Order[]>;
    findOne(id: string): Promise<import("./entities/order.entity").Order>;
    updateStatus(id: string, status: string, req: any): Promise<import("./entities/order.entity").Order>;
}
