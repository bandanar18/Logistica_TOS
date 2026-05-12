import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { Vehicle } from './entities/vehicle.entity';
import { Driver } from './entities/driver.entity';
import { Trip } from './entities/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Driver, Trip])],
  controllers: [TransportController],
  providers: [TransportService],
})
export class TransportModule {}
