import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { HttpModule } from '@nestjs/axios'; //ensuring the necessary HTTP-related functionality is available for making requests in the services.

import { MongooseModule } from '@nestjs/mongoose';
import { Plants, PlantsSchema } from './plants.schema';  // Import the schema
import { PlantIdSchema } from './plant_ids.schema';  // Ensure correct path

@Module({
  imports: [HttpModule,
    MongooseModule.forFeature([{name: Plants.name, schema: PlantsSchema}]),
    MongooseModule.forFeature([
      { name: 'PlantId', schema: PlantIdSchema }, // Add the PlantId schema here
    ]),

  ], 
  exports: [PlantsService],
  providers: [PlantsService],
  controllers: [PlantsController]
})
export class PlantsModule {}
