import { Module } from '@nestjs/common';
import { StorageLocationsService } from './storage_locations.service';
import { StorageLocationsController } from './storage_locations.controller';

@Module({
  providers: [StorageLocationsService],
  controllers: [StorageLocationsController]
})
export class StorageLocationsModule {}
