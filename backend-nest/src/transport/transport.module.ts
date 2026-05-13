import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { Vehicle } from './entities/vehicle.entity';
import { Driver } from './entities/driver.entity';
import { Trip } from './entities/trip.entity';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, Driver, Trip]),
    forwardRef(() => OrdersModule),
  ],
  controllers: [TransportController],
  providers: [TransportService],
  exports: [TransportService],
})
export class TransportModule {}
