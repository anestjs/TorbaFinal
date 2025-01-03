import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'fast-csv';
import { Crop, CropDocument } from './crop.schema'; 
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';


@Injectable()
export class CropDataService {

    constructor(@InjectModel(Crop.name) private CropModel: Model<CropDocument>){}

    private readonly criticalColumns = [
        "Genus", "Species", "ScientificName", "CommonName",
        "TemperatureMinimum", "pH_Minimum", "pH_Maximum",
        "Precipitation_Minimum", "Precipitation_Maximum",
        "MoistureUse", "AdaptedCoarseSoils", "AdaptedMediumSoils",
        "AdaptedFineSoils", "ShadeTolerance", "DroughtTolerance",
    ]; 

    async structureData(source: string): Promise<void> {
        const cleaned: any[] = [];
      
        fs.createReadStream(source)
          .pipe(parse({ headers: true }))
          .on('data', async (row) => {  // Mark this function as async
            const missingData = this.criticalColumns.some(
              (column) => row[column] === undefined || row[column] === ''
            );
      
            if (missingData) {
              return; // skip line
            }
      
            //console.log(row);
            cleaned.push(row);
      
            await this.saveToDB(row);  
            
          })
          .on('end', () => {
            console.log(`Finished processing. Cleaned data: ${cleaned.length} rows.`);
          });
      }
      

    
      private async saveToDB(data: any): Promise<void> {
        const cropData = new this.CropModel({
            genus: data['Genus'],  // Ensure correct mapping
            species: data['Species'],
            scientific_name: data['ScientificName'],
            common_name: data['CommonName'],
            temperature_minimum: data['TemperatureMinimum'],
            ph_minimum: data['pH_Minimum'],
            ph_maximum: data['pH_Maximum'],
            precipitation_minimum: data['Precipitation_Minimum'],
            precipitation_maximum: data['Precipitation_Maximum'],
            moisture_use: data['MoistureUse'],
            adapted_coarse_soils: data['AdaptedCoarseSoils'],
            adapted_medium_soils: data['AdaptedMediumSoils'],
            adapted_fine_soils: data['AdaptedFineSoils'],
            shade_tolerance: data['ShadeTolerance'],
            drought_tolerance: data['DroughtTolerance'],
        });
    
        try {
            await cropData.save();
            console.log('Data saved to MongoDB');
        } catch (error) {
            console.error('Error saving data to MongoDB:', error);
        }
    }
    
    async count(): Promise<void>{
        const cropsWithoutImageCount = await this.CropModel.countDocuments({ 
            $or: [
                { image: { $exists: false } }, 
                { image: "" }
            ]
        })
        .sort({ $natural: -1 });
        
        console.log(`Number of crops without an image: ${cropsWithoutImageCount}`);
    }

    private async getImageUrl(query: string): Promise<string> {
        try {
            if(query == "retry"){
            }
            const request = `https://perenual.com/api/species-list?key=sk-a3vZ6776c0f5dea898130&q=${query}`;

            console.log(`Making API call: ${request}`);
            const response = await axios.get(request);
    
            // Extract the image URL
            let imageUrl = response.data?.data?.[0]?.default_image?.regular_url;
    
            if (!imageUrl && response.data?.data?.[1]?.default_image?.regular_url) {
                console.log(`No valid image in the first document. Trying the second document...`);
                imageUrl = response.data?.data?.[1]?.default_image?.regular_url;
            }

            // Check if it's the default upgrade image
            if (imageUrl === 'https://perenual.com/storage/image/upgrade_access.jpg') {
                console.log(`Default image returned for query: ${query}.`);
                return ''; // Treat as no image found
            }
    
            return imageUrl || ''; // Return valid image or empty string if not found
        } catch (error) {
            console.error(`Error fetching image from Perenual API for query: ${query}`, error);
            return ''; // Treat API failure as no image found
        }
    }

    async addImagesToExistingDocs(): Promise<void> {

        const cropsWithoutImage = await this.CropModel.find({ 
            $or: [
                { image: { $exists: false } }, 
                { image: "" }
            ]
        });

        if (cropsWithoutImage.length === 0) {
            console.log('All documents already have images.');
            return;
        }
    
        for (const crop of cropsWithoutImage) {
            let imageUrl = await this.getImageUrl(crop.scientific_name);
        
            if (!imageUrl) {
                console.log(`No image found for scientific name: ${crop.scientific_name}. Trying the  common name from the result...`);
                imageUrl = await this.getImageUrl("retry");
            }
        
            // if (!imageUrl) {
            //     console.log(`No image found for genus: ${crop.genus}. Trying common name...`);
            // }
        
            if (!imageUrl) {
                console.log(`No image found for common name: ${crop.common_name}. Trying first name of scientific name...`);
               // const firstName = crop.scientific_name.split(' ')[0];
                // imageUrl = await this.getImageUrl(firstName);
            }
        
            if (imageUrl) {
                crop.image = imageUrl; // Update the crop document with the image URL
                await crop.save(); // Save the updated document
                console.log(`Updated crop: ${crop.common_name} with image.`);
            } else {
                console.log(`No valid image found for ${crop.common_name}.`);
            }
        }
        
        
    }
    
}


