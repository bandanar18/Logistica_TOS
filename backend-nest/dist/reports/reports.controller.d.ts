import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSummary(): Promise<{
        kpis: {
            users: number;
            activeStores: number;
            quotations: number;
            executingOrders: number;
            totalPayments: number;
            confirmedRevenue: number;
            marketplaceCommissions: number;
            tripsInProgress: number;
            itemsInStorage: number;
        };
        generatedAt: string;
    }>;
    getStoreDashboard(req: any): Promise<{
        quotationsCount: number;
        activeOrdersCount: number;
        totalCommissions: number;
        storeRating: number;
    }>;
    getClientDashboard(req: any): Promise<{
        quotationsCount: number;
        activeOrdersCount: number;
        documentsCount: number;
    }>;
}
