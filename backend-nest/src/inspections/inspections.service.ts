import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection } from './entities/inspection.entity';
import { InspectionResult } from './entities/inspection-result.entity';
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(Inspection)
    private inspectionRepo: Repository<Inspection>,
    @InjectRepository(InspectionResult)
    private resultRepo: Repository<InspectionResult>,
    private auditService: AuditService,
  ) {}

  async findAll(): Promise<Inspection[]> {
    return this.inspectionRepo.find({ relations: ['order', 'inspector'] });
  }

  async create(data: any, user: User): Promise<Inspection> {
    const inspection = this.inspectionRepo.create(data);
    const saved = await this.inspectionRepo.save(inspection) as any;
    
    await this.auditService.log({
      user,
      module: 'inspections',
      action: 'inspection.created',
      entityType: 'inspection',
      entityId: saved.id.toString(),
      details: { type: saved.inspectionType }
    });
    
    return saved;
  }

  async saveResult(id: number, resultData: any, user: User): Promise<InspectionResult> {
    const inspection = await this.inspectionRepo.findOne({ where: { id } });
    if (!inspection) throw new NotFoundException('Inspection not found');

    const result = this.resultRepo.create({
      ...resultData,
      inspection
    });
    const savedResult = await this.resultRepo.save(result) as any;

    inspection.status = 'completed';
    await this.inspectionRepo.save(inspection);

    await this.auditService.log({
      user,
      module: 'inspections',
      action: 'inspection.result.created',
      entityType: 'inspection',
      entityId: id.toString(),
      details: { verdict: savedResult.verdict }
    });

    return savedResult;
  }
}
