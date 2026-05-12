import { TransportService } from './transport.service';
export declare class TransportController {
    private readonly transportService;
    constructor(transportService: TransportService);
    findAllTrips(): Promise<import("./entities/trip.entity").Trip[]>;
    createTrip(data: any, req: any): Promise<import("./entities/trip.entity").Trip>;
    updateStatus(id: string, data: {
        status: string;
    }, req: any): Promise<import("./entities/trip.entity").Trip>;
    findAllVehicles(): Promise<import("./entities/vehicle.entity").Vehicle[]>;
    findAllDrivers(): Promise<import("./entities/driver.entity").Driver[]>;
}
