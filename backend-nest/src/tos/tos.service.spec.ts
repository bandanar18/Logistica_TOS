import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditService } from '../audit/audit.service';
import { Container } from './entities/container.entity';
import { Move } from './entities/move.entity';
import { Yard } from './entities/yard.entity';
import { TosService } from './tos.service';

const repoMock = { find: jest.fn(), findOne: jest.fn(), create: jest.fn(), save: jest.fn() };

describe('TosService', () => {
  let service: TosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TosService,
        { provide: getRepositoryToken(Container), useValue: repoMock },
        { provide: getRepositoryToken(Move), useValue: repoMock },
        { provide: getRepositoryToken(Yard), useValue: repoMock },
        { provide: AuditService, useValue: { log: jest.fn() } },
      ],
    }).compile();

    service = module.get<TosService>(TosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
