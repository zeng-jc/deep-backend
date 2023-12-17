import { Test, TestingModule } from '@nestjs/testing';
import { DeepOrmService } from './deep-orm.service';

describe('DeepOrmService', () => {
  let service: DeepOrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeepOrmService],
    }).compile();

    service = module.get<DeepOrmService>(DeepOrmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
