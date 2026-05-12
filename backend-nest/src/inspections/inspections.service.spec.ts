import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditService } from '../audit/audit.service';
import { InspectionResult } from './entities/inspection-result.entity';
import { Inspection } from './entities/inspection.entity';
import { InspectionsService } from './inspections.service';

const repoMock = { find: jest.fn(), findOne: jest.fn(), create: jest.fn(), save: jest.fn() };

describe('InspectionsService', () => {
  let service: InspectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InspectionsService,
        { provide: getRepositoryToken(Inspection), useValue: repoMock },
        { provide: getRepositoryToken(InspectionResult), useValue: repoMock },
        { provide: AuditService, useValue: { log: jest.fn() } },
      ],
    }).compile();

    service = module.get<InspectionsService>(InspectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
