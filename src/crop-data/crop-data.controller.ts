import { Controller, Get } from '@nestjs/common';
import { CropDataService } from './crop-data.service';

@Controller('crop-data')
export class CropDataController {
    constructor(private readonly dataService: CropDataService){}

    @Get('clean')
    async cleanData() {
        const source = './src/crop-data/filtered_dataset.csv';  // Relative path to the project folder
        
        await this.dataService.structureData(source);

        return{ message: 'Data cleaning completed'}
    }

    @Get('addImages')
    async addImages(){
        await this.dataService.addImagesToExistingDocs();

        return{ message: 'Adding 100 images completed'}
    }
    @Get('count')
    async count(){
        const count =  this.dataService.count();

        return{ message:count }
    }
}
