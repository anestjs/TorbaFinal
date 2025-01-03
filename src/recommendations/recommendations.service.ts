import { Injectable } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { Crop } from 'src/crop-data/crop.schema';
import { RecommendationResult } from './recommendations-types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';
import { RecommendationDocument, RecommendationModel } from './recommendations.schema';


@Injectable()
export class RecommendationsService {
  constructor(
    private readonly weather : WeatherService,
    @InjectModel('Crop') private cropMpdel: Model<Crop>,
    @InjectModel(RecommendationModel.name) private recsModel: Model<RecommendationDocument>,
    @InjectModel('User') private userModel : Model<User>,
  ) {}

  async generate_save_recs(userId: string, landId: string):Promise<RecommendationResult[]>{
    // land data
    const user = await this.userModel.findOne({
      '_id':userId,
      'lands._id': landId
    });

    if(!user) throw new Error('No registred land found');

    const land = user.lands.find(l => l._id?.toString() === landId);

    console.log(land)  
      console.log(landId)
      
    const weatherData = await this.weather.getExtremeValues(
      land.latitude , 
      land.longitude
    );

    const seasonalData= await this.weather.seasonAnalysis(
      land.latitude,
      land.longitude
    );

    const crops = await this.cropMpdel.find().exec() ; 
    const recs = await Promise.all(
      crops.map(crop => this.scoreCrope(crop, weatherData, seasonalData, land))
    );

    const bestRecs = recs.filter(rec => rec.score>=50)
    // sort desc , if b is higher there a + num , then b is placed before a , and vice versa
    .sort((a,b) => b.score - a.score)
    .slice(0,12);

    await this.recsModel.findOneAndUpdate(
      {landId , userId},
      {
        recommendations: bestRecs.map(rec => ({
          cropId: rec.crop._id,
          score: rec.score,
          reasons: rec.reasons
        }
      ))
      },
      // upsert => update or insert
      // new => the updated version is returned
      { upsert : true , new: true}
    );
    return bestRecs ; 

  }

  async scoreCrope(crop, weatherData , seasonalData, land): Promise<RecommendationResult>{

    // weather data => extremes
    // seasonalData => seasonak stats..

    let score = 100 ; 
    const reasons: string[] = [];

    const minTemp = parseFloat(crop.temperature_minimum) ; 
    if(weatherData.temperature.absoluteMin < minTemp){
      console.log(weatherData.temperature.absoluteMin)
      console.log(crop.scientific_name)
      console.log(minTemp)
      score -= 50 ; 
      reasons.push(`Winter temperatures (${weatherData.temperature.absoluteMin}°C) too low for crop tolerance (${minTemp}°C)`);
    }

    const minPrecip = parseFloat(crop.precipitation_minimum);
    const maxPrecip = parseFloat(crop.precipitation_maximum);

    if(weatherData.precipitation.annual < minPrecip){
      score -= 30;
      reasons.push('Insufficient annual precipitation');
    }

    if(weatherData.precipitation.annual > maxPrecip){
      score -= 20;
      reasons.push('Excessive annual precipitation');
    }

    if (land.soil_ph) {
      const minPh = parseFloat(crop.ph_minimum);
      const maxPh = parseFloat(crop.ph_maximum);
      
      if (land.soil_ph < minPh || land.soil_ph > maxPh) {
        score -= 35;
        reasons.push(`Soil pH (${land.soil_ph}) outside optimal range (${minPh}-${maxPh})`);
      }
    }

    if(crop.drought_tolerance === 'Low'){
      const summerPrecip = seasonalData.seasonal.summer.precipitation ; 
      if(summerPrecip < 5 ){
        score -=25;
        reasons.push('Low drought tolerance might be a problem during dry summers');
      }
    }

    const soilAdaptation = this.checkSoilAdaptation(crop);
    const soilAdaptationScore = soilAdaptation.score;
    const soilAdaptationReasons = soilAdaptation.reasons;

    score -= (20 - soilAdaptationScore);
    if (soilAdaptationScore < 20) {
      reasons.push(`Limited soil type adaptability: ${soilAdaptationReasons.join(', ')}`);
    }

    return{
      crop, score , reasons
    };

  }

  private checkSoilAdaptation(crop) {
    let score = 0;
    const reasons: string[] = [];
  
    if (crop.adapted_coarse_soils === 'Yes') {
      score += 7;
    } else {
      reasons.push('Not adapted to coarse soils');
    }
  
    if (crop.adapted_medium_soils === 'Yes') {
      score += 7;
    } else {
      reasons.push('Not adapted to medium soils');
    }
  
    if (crop.adapted_fine_soils === 'Yes') {
      score += 6;
    } else {
      reasons.push('Not adapted to fine soils');
    }
  
    return { score, reasons };
  }

  async getRecs(userId: string, landId: string): Promise<RecommendationResult[]> {
    const existingRecs = await this.recsModel
        .findOne({ landId, userId })
        .populate('recommendations.cropId')
        .exec();
    
    if (existingRecs) {
        return existingRecs.recommendations.map(rec => ({
            crop: rec.cropId as unknown as Crop, // Because populate() fills this
            score: rec.score,
            reasons: rec.reasons
        }));
    }
    
    return this.generate_save_recs(userId, landId);
}
  
}
