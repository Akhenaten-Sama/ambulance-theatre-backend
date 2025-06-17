import { Test, TestingModule } from '@nestjs/testing';
import { TheatreController } from './theatre.controller';

describe('TheatreController', () => {
  let controller: TheatreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TheatreController],
    }).compile();

    controller = module.get<TheatreController>(TheatreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
