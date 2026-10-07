import { Test, TestingModule } from '@nestjs/testing';
import { AmbulanceController } from './ambulance.controller';
import { AmbulanceService } from './ambulance.service';

describe('AmbulanceController', () => {
  let controller: AmbulanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmbulanceController],
      providers: [{ provide: AmbulanceService, useValue: {} }],
    }).compile();

    controller = module.get<AmbulanceController>(AmbulanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
