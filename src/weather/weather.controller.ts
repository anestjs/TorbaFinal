import { Controller, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService){}

    @Get("structure")
    async getStructuredWeather() {
        const lat = 33.57; 
        const long = -7.58;

        try {
            const data = await this.weatherService.getHistData(lat, long);
            return { message: data }; 
            
        } catch (error) {

            return { error: 'Failed to fetch weather data', details: error.message };
        }
    }

}
