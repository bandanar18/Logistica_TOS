import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { Vehicle } from './entities/vehicle.entity';
import { Driver } from './entities/driver.entity';
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';
export declare class TransportService {
    private tripRepo;
    private vehicleRepo;
    private driverRepo;
    private auditService;
    constructor(tripRepo: Repository<Trip>, vehicleRepo: Repository<Vehicle>, driverRepo: Repository<Driver>, auditService: AuditService);
    findAllTrips(): Promise<Trip[]>;
    createTrip(data: any, user: User): Promise<Trip>;
    updateTripStatus(id: number, status: string, user: User): Promise<Trip>;
    findAllVehicles(): Promise<Vehicle[]>;
    findAllDrivers(): Promise<Driver[]>;
}
