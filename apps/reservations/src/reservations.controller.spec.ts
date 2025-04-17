import { Test, TestingModule } from '@nestjs/testing';
import { reservationsController } from './reservations.controller';
import { reservationsService } from './reservations.service';

describe('reservationsController', () => {
  let controller: reservationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [reservationsController],
      providers: [reservationsService],
    }).compile();

    controller = module.get<reservationsController>(reservationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
