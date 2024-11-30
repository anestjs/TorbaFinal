/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { HttpModule } from '@nestjs/axios'; //ensuring the necessary HTTP-related functionality is available for making requests in the services.

@Module({
  imports: [HttpModule], 
  providers: [PlantsService],
  controllers: [PlantsController]
})
export class PlantsModule {}
