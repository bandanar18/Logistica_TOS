import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { Vehicle } from './entities/vehicle.entity';
import { Driver } from './entities/driver.entity';
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(Trip)
    private tripRepo: Repository<Trip>,
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(Driver)
    private driverRepo: Repository<Driver>,
    private auditService: AuditService,
  ) {}

  async findAllTrips(): Promise<Trip[]> {
    return this.tripRepo.find({ relations: ['vehicle', 'driver', 'order'] });
  }

  async createTrip(data: any, user: User): Promise<Trip> {
    const trip = this.tripRepo.create(data);
    const saved = await this.tripRepo.save(trip) as any;
    
    await this.auditService.log({
      user,
      module: 'transport',
      action: 'trip.created',
      entityType: 'trip',
      entityId: saved.id.toString(),
      details: { origin: saved.origin, destination: saved.destination }
    });
    
    return saved;
  }

  async updateTripStatus(id: number, status: string, user: User): Promise<Trip> {
    const trip = await this.tripRepo.findOne({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');

    const oldStatus = trip.status;
    trip.status = status;
    if (status === 'in_transit') trip.startedAt = new Date();
    if (status === 'completed') trip.completedAt = new Date();

    const updated = await this.tripRepo.save(trip) as any;

    await this.auditService.log({
      user,
      module: 'transport',
      action: 'trip.status_changed',
      entityType: 'trip',
      entityId: id.toString(),
      details: { oldStatus, newStatus: status }
    });

    return updated;
  }

  async findAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleRepo.find();
  }

  async findAllDrivers(): Promise<Driver[]> {
    return this.driverRepo.find();
  }
}
