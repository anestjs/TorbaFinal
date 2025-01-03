import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Weather } from './weather.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {

  private readonly WEATHER_URL = 'https://power.larc.nasa.gov/api/temporal/monthly/point';
  private readonly START_YEAR = 2018;
  private readonly END_YEAR = 2023;

  constructor(private readonly httpService: HttpService) {}

  async getHistData(latitude: number, longitude: number){
    try {
      const response = await firstValueFrom ( 
      this.httpService.get(this.WEATHER_URL ,{
        params: {
          parameters: 'T2M,T2M_MAX,T2M_MIN,RH2M,TS,PRECTOTCORR,PS,WS10M,WS10M_MAX,WS10M_MIN',
          community: 'SB',
          longitude,
          latitude,
          format: 'JSON',
          start: this.START_YEAR,
          end: this.END_YEAR
        },
      })
    );

      return this.processWeatherData(response.data.properties.parameter);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  
  private processWeatherData(parameters: Weather) {

    const weatherData = Object.keys(parameters.T2M).map(date => {

      // 201801 -> 2018-01
      const formattedDate = `${date.substring(0, 4)}-${date.substring(4)}`;

      return {
        date: formattedDate,
        temperature: {
          average: parameters.T2M[date],
          max: parameters.T2M_MAX[date],
          min: parameters.T2M_MIN[date],
        },
        humidity: parameters.RH2M[date],
        surfaceTemp: parameters.TS[date],
        precipitation: parameters.PRECTOTCORR[date],
        pressure: parameters.PS[date],
        wind: {
          average: parameters.WS10M[date],
          max: parameters.WS10M_MAX[date],
          min: parameters.WS10M_MIN[date],
        },
      };
    });

    const monthlyData = weatherData.slice(0,12);
    const annualData = weatherData[12];

    return {
      monthlyData: monthlyData,
      annualData: annualData
    };
  }


  private average(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  private statistics(data: any[]) {
    return {
      average: this.average(data.map(d => d.average)),
      maxRecorded: Math.max(...data.map(d => d.max)),
      minRecorded: Math.min(...data.map(d => d.min)),
    };
  }

  // {
  //   "seasonal": {
  //     "spring": {
  // { "date": "2023-03", "temperature": { "average": 20 }, "humidity": 65, "precipitation": 60 },
  // { "date": "2023-04", "temperature": { "average": 22 }, "humidity": 70, "precipitation": 55 },
  // { "date": "2023-05", ....
  // },
  //     "summer": { },
  //     "fall":   { },
  //     "winter": { }
  //   },
  //   "annual": { }
  // }

  async seasonAnalysis(latitude:number, longitude:number){
    const data = await this.getHistData(latitude, longitude);

    const seasons = {
      spring: this.seasonsStats(data.monthlyData, ['03', '04', '05']) ,
      summer: this.seasonsStats(data.monthlyData, ['06', '07', '08']) ,
      fall: this.seasonsStats(data.monthlyData, ['09', '10', '11']) ,
      winter: this.seasonsStats(data.monthlyData, ['12', '01', '02']) 
    };

    return {
      seasonal: seasons,
      annual: data.annualData
    };
  }

  // calcul

  private seasonsStats(data: any[], months: string[]){
    const seasonalData = data.filter(record => {
      const month = record.date.split('-')[1];
      return months.includes(month)
    });

    if (seasonalData.length === 0) return null;

    return {
      temperature: {
        average: this.average(seasonalData.map(d => d.temperature.average)),
        max: Math.max(...seasonalData.map(d => d.temperature.max)),
        min: Math.min(...seasonalData.map(d => d.temperature.min))
      },
      humidity: this.average(seasonalData.map(d => d.humidity)),
      surfaceTemp: this.average(seasonalData.map(d => d.surfaceTemp)),
      precipitation: this.average(seasonalData.map(d => d.precipitation)),
      pressure: this.average(seasonalData.map(d => d.pressure)),
      wind: {
        average: this.average(seasonalData.map(d => d.wind.average)),
        max: Math.max(...seasonalData.map(d => d.wind.max)),
        min: Math.min(...seasonalData.map(d => d.wind.min))
      }
    };
  }

  async getExtremeValues(latitude: number, longitude: number) {
    const { monthlyData } = await this.getHistData(latitude, longitude);
    
    return {
      temperature: {
        // max - min temp in the month
        // d is used to iterate through the data
        absoluteMax: Math.max(...monthlyData.map(d => d.temperature.max)),
        absoluteMin: Math.min(...monthlyData.map(d => d.temperature.min)),
        // average of the max -- min temp
        averageMax: this.average(monthlyData.map(d => d.temperature.max)),
        averageMin: this.average(monthlyData.map(d => d.temperature.min))
      },
      precipitation: {
        maxMonthly: Math.max(...monthlyData.map(d => d.precipitation)),
        minMonthly: Math.min(...monthlyData.map(d => d.precipitation)),
        // sum-> accumulator , d-> currentvalue
        // sum is to be returned when the iteration is complete through the months of the data
        // and then we get the sum of the annual precipitation
        // 
        annual: monthlyData.reduce((sum, d) => sum + d.precipitation, 0)
      },
      humidity: {
        max: Math.max(...monthlyData.map(d => d.humidity)),
        min: Math.min(...monthlyData.map(d => d.humidity)),
        average: this.average(monthlyData.map(d => d.humidity))
      }
    };
  }
  
}
