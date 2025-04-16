import { Test, TestingModule } from '@nestjs/testing';
import { ResveervationsController } from './resveervations.controller';
import { ResveervationsService } from './resveervations.service';

describe('ResveervationsController', () => {
  let controller: ResveervationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResveervationsController],
      providers: [ResveervationsService],
    }).compile();

    controller = module.get<ResveervationsController>(ResveervationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
