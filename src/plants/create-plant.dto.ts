/* eslint-disable prettier/prettier */
import { IsArray, IsString } from 'class-validator';

export class CreatePlantDto{
    @IsString()
    common_name: string;

    @IsArray()
    @IsString({ each: true })
    scientific_name: string[];

    @IsString()
    cycle: string;

    @IsString()
    watering: string;

    @IsArray()
    @IsString({ each: true })
    sunlight: string[];

    @IsString()
    image: string;
    
}