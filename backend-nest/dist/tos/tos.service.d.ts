import { Repository } from 'typeorm';
import { Container } from './entities/container.entity';
import { Move } from './entities/move.entity';
import { Yard } from './entities/yard.entity';
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';
export declare class TosService {
    private containerRepo;
    private moveRepo;
    private yardRepo;
    private auditService;
    constructor(containerRepo: Repository<Container>, moveRepo: Repository<Move>, yardRepo: Repository<Yard>, auditService: AuditService);
    findAllContainers(): Promise<Container[]>;
    createContainer(data: any, user: User): Promise<Container>;
    moveContainer(id: number, toYardId: number, toLocation: string, user: User): Promise<Container>;
    findAllYards(): Promise<Yard[]>;
}
