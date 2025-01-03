import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';   
import { catchError, lastValueFrom, Observable, throwError } from 'rxjs';
import { Plants } from './plants.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlantDto } from './create-plant.dto';
import { PlantId } from './plant_ids.schema';

@Injectable()
export class PlantsService {
    constructor(private httpServ: HttpService , @InjectModel(Plants.name) private plantsModel: Model<Plants>,
    @InjectModel('PlantId') private readonly plantIdModel: Model<PlantId>,
) {}

    // promise represents the result of an asyn operation : pending-fulfilled-rejected
    async savePlants(): Promise<void> {
        // Fetch all the plant IDs from the 'plant_ids' collection
        const plantIds = await this.plantIdModel.find().exec();
    
        for (const plantId of plantIds) {
            // Fetch plant details using the plant ID
            const plantDetails = await this.getPlantDetails(plantId.plant_id);
            console.log("test")
            console.log(plantId.plant_id)
            // Create DTO to save relevant data in the 'plants' collection
            const createPlantDto: CreatePlantDto = {
                common_name: plantDetails.common_name,
                scientific_name: plantDetails.scientific_name,
                cycle: plantDetails.cycle,
                watering: plantDetails.watering,
                sunlight: plantDetails.sunlight,
                image: plantDetails.default_image?.original_url || 'unavailable',
                hardiness_min: plantDetails.hardiness?.min || null,
                hardiness_max: plantDetails.hardiness?.max || null,
                watering_period: plantDetails.watering_general_benchmark?.value || null,
                maintenance: plantDetails.maintenance || null,
                soil: plantDetails.soil || [],
                growth_rate: plantDetails.growth_rate || null,
                drought_tolerant: plantDetails.drought_tolerant || false,
                description: plantDetails.description || 'No description available',
            };
    
            // Save the plant data into the 'plants' collection
            await this.plantsModel.create(createPlantDto);
        }
    }
    

    async getPlantDetails(plantId: string): Promise<any> {
        const url = `https://perenual.com/api/species/details/${plantId}?key=sk-yvfr676fbb5c7cfc28097`;
        const response = await lastValueFrom(this.httpServ.get(url));
        return response.data ; 
    }

    async addPlantId(): Promise<void> {
        try {
            // Loop through pages
            for (let page = 1; page <= 4; page++) {
                // Fetch data for the current page
                const page_data = await this.getPlantsApi(page);
    
                if (!page_data || page_data.length === 0) {
                    console.log(`No data found for page ${page}`);
                    continue;  // Skip to next page if no data is found
                }
    

                for (const plant of page_data) {
                    const newPlantId = new this.plantIdModel({ plant_id: plant.id });
                    await newPlantId.save();  // Save the new plant ID to the database
                }
            }
        } catch (error) {
            console.error("Error in adding plant IDs:", error);
            throw new Error("Error saving plant IDs");  // Throw an error to indicate failure
        }
    }
    
    async getPlantsByTemperature(minTemp: number, maxTemp: number): Promise<Plants[]> {
        const plants = await this.plantsModel.find().exec();
    
        return plants.filter(plant => {
          // 
          // hardiness zone falls within the  range
          const plantMinTemp = parseFloat(plant.hardiness_min);
          const plantMaxTemp = parseFloat(plant.hardiness_max);
    
          return plantMinTemp <= maxTemp && plantMaxTemp >= minTemp;
        });
    }

    private async getPlantsApi(page: number){
        const url = `https://perenual.com/api/species-list?key=sk-EKS1673f4540e7e9e7725&edible=1&hardiness=6-13&page=${page}`;
        const response = await lastValueFrom(this.httpServ.get(url));
        return response.data.data ; 
    }

    async findAll(): Promise<Plants[]> {
        return this.plantsModel.find().exec();
    }

    PlantsDetails(page: number): Observable<any> {
        const url = `https://perenual.com/api/species-list?key=sk-EKS1673f4540e7e9e7725&edible=1&hardiness=6-13&page=${page}`;
        
        return this.httpServ.get(url).pipe(
            catchError((error) => {
                console.error('API request failed:', error);
                return throwError(() => new Error('API request failed'));
            })
        );
    }
}