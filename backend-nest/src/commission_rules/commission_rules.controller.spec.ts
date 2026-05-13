import { Test, TestingModule } from '@nestjs/testing';
import { CommissionRulesController } from './commission_rules.controller';

describe('CommissionRulesController', () => {
  let controller: CommissionRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommissionRulesController],
    }).compile();

    controller = module.get<CommissionRulesController>(CommissionRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
