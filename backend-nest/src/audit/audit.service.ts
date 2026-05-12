import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async log(data: {
    user?: User;
    module: string;
    action: string;
    entityType?: string;
    entityId?: string;
    details?: any;
  }): Promise<AuditLog> {
    const entry = this.auditRepository.create(data);
    return this.auditRepository.save(entry) as any;
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

 