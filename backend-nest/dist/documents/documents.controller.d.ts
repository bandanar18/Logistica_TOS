import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    create(data: any, req: any): Promise<import("./entities/document.entity").Document>;
    findAll(req: any): Promise<import("./entities/document.entity").Document[]>;
    updateStatus(id: string, status: string, req: any): Promise<import("./entities/document.entity").Document>;
}
