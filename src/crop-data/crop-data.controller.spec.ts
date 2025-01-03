import { Test, TestingModule } from '@nestjs/testing';
import { CropDataController } from './crop-data.controller';

describe('CropDataController', () => {
  let controller: CropDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropDataController],
    }).compile();

    controller = module.get<CropDataController>(CropDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
