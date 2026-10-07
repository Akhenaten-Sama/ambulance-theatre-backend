import { Test, TestingModule } from '@nestjs/testing';
import { AmbulanceService } from './ambulance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ambulance } from './ambulance.entity';
import { User } from '../user/user.entity';

describe('AmbulanceService', () => {
  let service: AmbulanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AmbulanceService,
        { provide: getRepositoryToken(Ambulance), useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
      ],
    }).compile();

    service = module.get<AmbulanceService>(AmbulanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
