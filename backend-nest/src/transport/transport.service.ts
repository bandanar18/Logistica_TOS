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
    return this.tripRepo.find({ relations: ['vehicle', 'driver', 'order', 'carrier'] });
  }

  async generateTripCode(): Promise<string> {
    const count = await this.tripRepo.count();
    const year = new Date().getFullYear();
    return `TRP-${year}-${(count + 1).toString().padStart(4, '0')}`;
  }

  async createTrip(data: any, user: User): Promise<Trip> {
    const tripCode = await this.generateTripCode();
    const trip = this.tripRepo.create({ ...data, tripCode });
    const saved = await this.tripRepo.save(trip) as any;
    
    await this.auditService.log({
      user,
      module: 'transport',
      action: 'trip.created',
      entityType: 'trip',
      entityId: saved.id.toString(),
      metadata: { code: saved.tripCode, origin: saved.originName, destination: saved.destinationName }
    });
    
    return saved;
  }

  async updateTripStatus(id: number, status: string, user: User): Promise<Trip> {
    try {
      const trip = await this.tripRepo.findOne({ 
        where: { id },
        relations: ['vehicle', 'driver', 'order', 'carrier']
      });
      if (!trip) throw new NotFoundException(`Trip with ID ${id} not found`);

      const oldStatus = trip.status;
      trip.status = status;
      
      if (status === 'IN_TRANSIT') trip.actualPickupAt = new Date();
      if (status === 'DELIVERED') trip.actualDeliveryAt = new Date();

      const updated = await this.tripRepo.save(trip);

      await this.auditService.log({
        user: { id: user.id } as any,
        module: 'transport',
        action: 'trip.status_changed',
        entityType: 'trip',
        entityId: id.toString(),
        metadata: { oldStatus, newStatus: status }
      }).catch(err => console.error('Audit log failed:', err));

      return updated;
    } catch (error) {
      console.error('Error updating trip status:', error);
      throw error;
    }
  }

  async findAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleRepo.find({ relations: ['store'] });
  }

  async findAllDrivers(): Promise<Driver[]> {
    return this.driverRepo.find({ relations: ['store'] });
  }
}
