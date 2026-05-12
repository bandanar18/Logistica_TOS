import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TosController } from './tos.controller';
import { TosService } from './tos.service';

describe('TosController', () => {
  let controller: TosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TosController],
      providers: [
        { provide: TosService, useValue: { findAllContainers: jest.fn(), createContainer: jest.fn(), moveContainer: jest.fn(), findAllYards: jest.fn() } },
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      ],
    }).compile();

    controller = module.get<TosController>(TosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
