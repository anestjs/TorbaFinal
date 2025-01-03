import { Test, TestingModule } from '@nestjs/testing';
import { CropDataService } from './crop-data.service';

describe('CropDataService', () => {
  let service: CropDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CropDataService],
    }).compile();

    service = module.get<CropDataService>(CropDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
