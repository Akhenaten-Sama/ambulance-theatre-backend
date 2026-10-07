import { Test, TestingModule } from '@nestjs/testing';
import { TheatreService } from './theatre.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Theatre } from './theatre.entity';
import { Hospital } from '../hospital/hospital.entity';

describe('TheatreService', () => {
  let service: TheatreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TheatreService,
        { provide: getRepositoryToken(Theatre), useValue: {} },
        { provide: getRepositoryToken(Hospital), useValue: {} },
      ],
    }).compile();

    service = module.get<TheatreService>(TheatreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
