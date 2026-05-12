import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionsService } from './inspections.service';
import { InspectionsController } from './inspections.controller';
import { Inspection } from './entities/inspection.entity';
import { InspectionResult } from './entities/inspection-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inspection, InspectionResult])],
  controllers: [InspectionsController],
  providers: [InspectionsService],
})
export class InspectionsModule {}
