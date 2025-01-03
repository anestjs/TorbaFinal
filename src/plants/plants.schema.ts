import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlantsDocument = HydratedDocument<Plants>;

@Schema({ collection: 'plants' })
export class Plants {

    @Prop({ required: true })
    common_name: string;

    @Prop({ required: true })
    scientific_name: string[];

    @Prop({ required: true })
    cycle: string;

    @Prop({ required: true })
    watering: string;

    @Prop({ required: true })
    sunlight: string[];

    @Prop({ required: true })
    image: string;

    @Prop({ required: false })
    hardiness_min: string;

    @Prop({ required: false })
    hardiness_max: string;

    @Prop({ required: false })
    watering_period: string;

    @Prop({ required: false })
    maintenance: string;

    @Prop({ required: false })
    soil: string[];

    @Prop({ required: false })
    growth_rate: string;

    @Prop({ required: false })
    drought_tolerant: boolean;

    @Prop({ required: false })
    description: string;
}

export const PlantsSchema = SchemaFactory.createForClass(Plants);
