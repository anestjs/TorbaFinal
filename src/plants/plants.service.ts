/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';   
import { catchError, lastValueFrom, Observable, throwError } from 'rxjs';
import { Plants } from './plants.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlantDto } from './create-plant.dto';

@Injectable()
export class PlantsService {
    constructor(private httpServ: HttpService , @InjectModel(Plants.name) private plantsModel: Model<Plants>) {}

    // promise represents the result of an asyn operation : pending-fulfilled-rejected
    async savePlants(): Promise<void> {
        for(let page = 1; page<=4 ; page++){

            const page_data = await this.getPlantsApi(page);

            for (const plant of page_data){
                const createPlantDto: CreatePlantDto = {
                    common_name: plant.common_name,
                    scientific_name: plant.scientific_name,
                    cycle: plant.cycle,
                    watering: plant.watering,
                    sunlight: plant.sunlight,
                    image: plant.default_image?.thumbnail || plant.default_image?.original_url || plant.default_image?.regular_url || 'unavailable',
                };

                await this.plantsModel.create(createPlantDto);
            }
        }
    }

    private async getPlantsApi(page: number){
        const url = `https://perenual.com/api/species-list?key=sk-EKS1673f4540e7e9e7725&edible=1&hardiness=6-11&page=${page}`;
        const response = await lastValueFrom(this.httpServ.get(url));
        return response.data.data ; 
    }

    async findAll(): Promise<Plants[]> {
        return this.plantsModel.find().exec();
    }

    PlantsDetails(page: number): Observable<any> {
        const url = `https://perenual.com/api/species-list?key=sk-EKS1673f4540e7e9e7725&edible=1&hardiness=6-11&page=${page}`;
        
        return this.httpServ.get(url).pipe(
            catchError((error) => {
                console.error('API request failed:', error);
                return throwError(() => new Error('API request failed'));
            })
        );
    }
}