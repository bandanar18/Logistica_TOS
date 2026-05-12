import { TosService } from './tos.service';
export declare class TosController {
    private readonly tosService;
    constructor(tosService: TosService);
    findAllContainers(): Promise<import("./entities/container.entity").Container[]>;
    createContainer(data: any, req: any): Promise<import("./entities/container.entity").Container>;
    moveContainer(id: string, moveDto: {
        toYardId: number;
        toLocation: string;
    }, req: any): Promise<import("./entities/container.entity").Container>;
    findAllYards(): Promise<import("./entities/yard.entity").Yard[]>;
}
