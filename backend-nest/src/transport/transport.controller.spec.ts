import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';

describe('TransportController', () => {
  let controller: TransportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportController],
      providers: [
        { provide: TransportService, useValue: { findAllTrips: jest.fn(), createTrip: jest.fn(), updateTripStatus: jest.fn(), findAllVehicles: jest.fn(), findAllDrivers: jest.fn() } },
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      ],
    }).compile();

    controller = module.get<TransportController>(TransportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
