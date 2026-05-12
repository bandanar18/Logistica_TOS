import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditService } from '../audit/audit.service';
import { Order } from '../orders/entities/order.entity';
import { Store } from '../stores/entities/store.entity';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

const repoMock = { find: jest.fn(), findOne: jest.fn(), create: jest.fn(), save: jest.fn() };

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: getRepositoryToken(Review), useValue: repoMock },
        { provide: getRepositoryToken(Store), useValue: repoMock },
        { provide: getRepositoryToken(Order), useValue: repoMock },
        { provide: AuditService, useValue: { log: jest.fn() } },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
