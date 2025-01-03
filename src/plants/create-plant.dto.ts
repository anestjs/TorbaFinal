import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePlantDto {
    
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

    @IsOptional() 
    @IsString()
    hardiness_min: string;

    @IsOptional() 
    @IsString()
    hardiness_max: string;

    @IsOptional() 
    @IsString()
    watering_period: string;

    @IsOptional() 
    @IsString()
    maintenance: string;

    @IsOptional() 
    @IsArray()
    @IsString({ each: true })
    soil: string[];

    @IsOptional() 
    @IsString()
    growth_rate: string;

    @IsOptional() 
    @IsBoolean()
    drought_tolerant: boolean;


    @IsOptional() 
    @IsString()
    description: string;
}
