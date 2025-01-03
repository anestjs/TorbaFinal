import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';

@Module({

  imports: [HttpModule],
  providers: [WeatherService],

  controllers: [WeatherController],
  exports:[WeatherService],
})
export class WeatherModule {}
