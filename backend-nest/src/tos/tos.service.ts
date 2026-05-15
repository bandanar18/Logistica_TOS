import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Container } from './entities/container.entity';
import { Move } from './entities/move.entity';
import { Yard } from './entities/yard.entity';
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TosService {
  constructor(
    @InjectRepository(Container)
    private containerRepo: Repository<Container>,
    @InjectRepository(Move)
    private moveRepo: Repository<Move>,
    @InjectRepository(Yard)
    private yardRepo: Repository<Yard>,
    private auditService: AuditService,
  ) {}

  async findAllContainers(): Promise<Container[]> {
    return this.containerRepo.find({ relations: ['yard'] });
  }

  async createContainer(data: any, user: User): Promise<Container> {
    const container = this.containerRepo.create(data);
    const saved = await this.containerRepo.save(container) as any;
    
    await this.auditService.log({
      user,
      module: 'tos',
      action: 'tos.container.created',
      entityType: 'container',
      entityId: saved.id.toString(),
      metadata: { containerNumber: saved.containerNumber }
    });
    
    return saved;
  }

  async moveContainer(id: number, toYardId: number, toLocation: string, user: User): Promise<Container> {
    const container = await this.containerRepo.findOne({ where: { id }, relations: ['yard'] });
    if (!container) throw new NotFoundException('Container not found');

    const toYard = await this.yardRepo.findOne({ where: { id: toYardId } });
    if (!toYard) throw new NotFoundException('Destination yard not found');

    const fromYard = container.yard;
    const fromLocation = container.locationInYard;

    // Create move record
    const move = this.moveRepo.create({
      container,
      fromYard,
      toYard,
      fromLocation,
      toLocation,
      moveType: 'internal'
    });
    await this.moveRepo.save(move);

    // Update container
    container.yard = toYard;
    container.locationInYard = toLocation;
    const updated = await this.containerRepo.save(container) as any;

    await this.auditService.log({
      user,
      module: 'tos',
      action: 'tos.container.moved',
      entityType: 'container',
      entityId: id.toString(),
      metadata: { fromYardId: fromYard?.id, toYardId, toLocation }
    });

    return updated;
  }

  async findAllYards(): Promise<Yard[]> {
    return this.yardRepo.find();
  }
}
