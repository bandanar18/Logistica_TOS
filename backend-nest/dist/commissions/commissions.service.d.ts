import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Commission } from './entities/commission.entity';
export declare class CommissionsService {
    private commissionsRepository;
    private ordersRepository;
    constructor(commissionsRepository: Repository<Commission>, ordersRepository: Repository<Order>);
    findAll(): Promise<Commission[]>;
    updateStatus(id: number, status: string): Promise<Commission>;
}
