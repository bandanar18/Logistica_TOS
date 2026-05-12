import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditService } from '../audit/audit.service';
import { Driver } from './entities/driver.entity';
import { Trip } from './entities/trip.entity';
import { Vehicle } from './entities/vehicle.entity';
import { TransportService } from './transport.service';

const repoMock = { find: jest.fn(), findOne: jest.fn(), create: jest.fn(), save: jest.fn() };

describe('TransportService', () => {
  let service: TransportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransportService,
        { provide: getRepositoryToken(Trip), useValue: repoMock },
        { provide: getRepositoryToken(Vehicle), useValue: repoMock },
        { provide: getRepositoryToken(Driver), useValue: repoMock },
        { provide: AuditService, useValue: { log: jest.fn() } },
      ],
    }).compile();

    service = module.get<TransportService>(TransportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
