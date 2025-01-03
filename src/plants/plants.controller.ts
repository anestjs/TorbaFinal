import {  Controller,Get, Param, Render } from '@nestjs/common';
import { PlantsService } from './plants.service';

@Controller('plants')
export class PlantsController {
    constructor(private readonly PlantsService: PlantsService) {}


    @Get("fetch-save")
    async fecthSavePlants(){
        await this.PlantsService.savePlants();
        return { message : "Plants from 1 to 4 saved successfully in the db !" };
    }
    @Get('addPlantId')
    async addPlantId(){
        try {
            await this.PlantsService.addPlantId();
            return { message: "Plant IDs from 1 to 4 saved successfully in the db!" };
        } catch (error) {
            console.error("Error in addPlantId controller:", error);
            return { message: "An error occurred while saving plant IDs.", error: error.message };
        }
    }
    
    // async pour les operations that take time and can block the execution of other tasks such as database operations and api fetching data
    @Get(":page")
    @Render('plants') 
    async getPlantsDetails(@Param('page') page: number) {
        try {
            const response = await this.PlantsService.PlantsDetails(page).toPromise(); 
            return { plants: response.data.data }; // Return the actual data, not the whole response object
        } catch (error) {
            console.error('Error in getPlantsDetails:', error);
            throw new Error('Failed to fetch plant details');
        }
    }

   
}
