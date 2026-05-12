import { InspectionsService } from './inspections.service';
export declare class InspectionsController {
    private readonly inspectionsService;
    constructor(inspectionsService: InspectionsService);
    findAll(): Promise<import("./entities/inspection.entity").Inspection[]>;
    create(data: any, req: any): Promise<import("./entities/inspection.entity").Inspection>;
    saveResult(id: string, resultData: any, req: any): Promise<import("./entities/inspection-result.entity").InspectionResult>;
}
