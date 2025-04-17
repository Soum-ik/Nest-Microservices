import { Test, TestingModule } from '@nestjs/testing';
import { reservationsService } from './reservations.service';

describe('reservationsService', () => {
  let service: reservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [reservationsService],
    }).compile();

    service = module.get<reservationsService>(reservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
