import { Inspection } from './inspection.entity';
export declare class InspectionResult {
    id: number;
    inspection: Inspection;
    findings: string;
    verdict: string;
    checklist: any;
    createdAt: Date;
}
