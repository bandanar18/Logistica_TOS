import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditService } from '../audit/audit.service';
import { InventoryItem } from './entities/inventory-item.entity';
import { StorageLocation } from './entities/storage-location.entity';
import { Warehouse } from './entities/warehouse.entity';
import { StorageService } from './storage.service';

const repoMock = { find: jest.fn(), findOne: jest.fn(), create: jest.fn(), save: jest.fn() };

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        { provide: getRepositoryToken(Warehouse), useValue: repoMock },
        { provide: getRepositoryToken(StorageLocation), useValue: repoMock },
        { provide: getRepositoryToken(InventoryItem), useValue: repoMock },
        { provide: AuditService, useValue: { log: jest.fn() } },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
