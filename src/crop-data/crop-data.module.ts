import { Module } from '@nestjs/common';
import { CropDataController } from './crop-data.controller';
import { CropDataService } from './crop-data.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Crop, CropSchema } from './crop.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Crop.name, schema: CropSchema }]),
  ],
  controllers: [CropDataController],
  providers: [CropDataService]
})
export class CropDataModule {}
