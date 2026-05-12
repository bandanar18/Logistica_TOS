import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    StoresModule
  ],
  providers: [ServicesService],
  controllers: [ServicesController],
  exports: [ServicesService, TypeOrmModule],
})
export class ServicesModule {}
