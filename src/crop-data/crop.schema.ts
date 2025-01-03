import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type CropDocument = HydratedDocument<Crop>;

@Schema({ collection: 'crops' , timestamps: true})
export class Crop extends Document {

    @Prop({ required: true })
    genus: string;

    @Prop({ required: true })
    species: string;

    @Prop({ required: true })
    scientific_name: string;

    @Prop({ required: true })
    common_name: string;

    @Prop({ required: true })
    temperature_minimum: string;

    @Prop({ required: true })
    ph_minimum: string;

    @Prop({ required: true })
    ph_maximum: string;

    @Prop({ required: true })
    precipitation_minimum: string;

    @Prop({ required: true })
    precipitation_maximum: string;

    @Prop({ required: true })
    moisture_use: string;

    @Prop({ required: true })
    adapted_coarse_soils: string;

    @Prop({ required: true })
    adapted_medium_soils: string;

    @Prop({ required: true })
    adapted_fine_soils: string;

    @Prop({ required: true })
    shade_tolerance: string;

    @Prop({ required: true })
    drought_tolerance: string;

    @Prop({ required: false })
    image: string; 
}

export const CropSchema = SchemaFactory.createForClass(Crop);
