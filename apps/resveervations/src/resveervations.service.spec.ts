import { Test, TestingModule } from '@nestjs/testing';
import { ResveervationsService } from './resveervations.service';

describe('ResveervationsService', () => {
  let service: ResveervationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResveervationsService],
    }).compile();

    service = module.get<ResveervationsService>(ResveervationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
