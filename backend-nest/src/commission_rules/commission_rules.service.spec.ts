import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommissionRule } from './entities/commission_rule.entity';
import { CommissionRulesService } from './commission_rules.service';

describe('CommissionRulesService', () => {
  let service: CommissionRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommissionRulesService,
        { provide: getRepositoryToken(CommissionRule), useValue: { find: jest.fn(), findOne: jest.fn(), create: jest.fn(), save: jest.fn() } },
      ],
    }).compile();

    service = module.get<CommissionRulesService>(CommissionRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
