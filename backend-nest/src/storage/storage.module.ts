import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { Warehouse } from './entities/warehouse.entity';
import { StorageLocation } from './entities/storage-location.entity';
import { InventoryItem } from './entities/inventory-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, StorageLocation, InventoryItem])],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
