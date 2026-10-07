import { Test, TestingModule } from '@nestjs/testing';
import { HospitalService } from './hospital.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hospital } from './hospital.entity';

describe('HospitalService', () => {
  let service: HospitalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HospitalService,
        { provide: getRepositoryToken(Hospital), useValue: {} },
      ],
    }).compile();

    service = module.get<HospitalService>(HospitalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
