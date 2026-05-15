import { AppService } from './app.service';
import { DataSource } from 'typeorm';
export declare class AppController {
    private readonly appService;
    private dataSource;
    constructor(appService: AppService, dataSource: DataSource);
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
        service: string;
        version: string;
    };
    getDbHealth(): Promise<{
        status: string;
        database: string;
        connection: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        database: string;
        error: any;
        timestamp: string;
        connection?: undefined;
    }>;
}
