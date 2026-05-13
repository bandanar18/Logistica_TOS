import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async log(data: {
    user?: User;
    userProfile?: string;
    module: string;
    action: string;
    entityType?: string;
    entityId?: string;
    entityCode?: string;
    oldValues?: any;
    newValues?: any;
    changeReason?: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
    metadata?: any;
  }): Promise<AuditLog> {
    const entry = this.auditRepository.create({
      ...data,
      auditCode: `AUD-${uuidv4().split('-')[0].toUpperCase()}`,
      severity: data.severity || 'LOW',
    });
    return this.auditRepository.save(entry) as any;
  }

  async findAll(filters?: any): Promise<AuditLog[]> {
    const query = this.auditRepository.createQueryBuilder('audit')
      .leftJoinAndSelect('audit.user', 'user')
      .orderBy('audit.createdAt', 'DESC')
      .take(100);

    if (filters?.module) query.andWhere('audit.module = :module', { module: filters.module });
    if (filters?.severity) query.andWhere('audit.severity = :severity', { severity: filters.severity });
    if (filters?.entityType) query.andWhere('audit.entityType = :entityType', { entityType: filters.entityType });

    return query.getMany();
  }

  async findByEntity(type: string, id: string): Promise<AuditLog[]> {
    return this.auditRepository.find({
      where: { entityType: type, entityId: id.toString() },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
