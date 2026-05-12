import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    summary(): Promise<{
        id: string;
        users: number;
        stores: number;
        quotations: number;
        orders: number;
        payments: number;
        confirmedRevenue: number;
        generatedAt: string;
    }[]>;
}
