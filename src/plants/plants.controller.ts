/* eslint-disable prettier/prettier */

import { Controller, Get, Param } from '@nestjs/common';
import { PlantsService } from './plants.service';

@Controller('plants')
export class PlantsController {
    constructor(private readonly PlantsService: PlantsService) {}

    // async pour les operations that take time and can block the execution of other tasks such as database operations and api fetching data
    @Get(":page")
    async getPlantsDetails(@Param('page') page: number) {
        try {
            const response = await this.PlantsService.PlantsDetails(page).toPromise(); 
            return response.data;  // Return the actual data, not the whole response object
        } catch (error) {
            console.error('Error in getPlantsDetails:', error);
            throw new Error('Failed to fetch plant details');
        }
    }
}
