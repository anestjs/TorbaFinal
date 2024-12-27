/* eslint-disable prettier/prettier */
import { Prop , Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

//ensures that the document includes both the schema properties and Mongoose instance methods.
export type PlantsDocument = HydratedDocument<Plants>;

@Schema({ collection: 'Plants' })
export class Plants {

    @Prop({required: true , unique: true , default: ()=> new Types.ObjectId()}) 
    id: Types.ObjectId;

    @Prop({ required: true })
    common_name: string;

    @Prop({ required: true })
    scientific_name: string[];  
    
    @Prop({ required: true })
    cycle: string;

    @Prop({ required: true })
    watering:string;

    @Prop({ required: true })
    sunlight:string[];

    @Prop({ required: true })
    image:string;

    
}
export const PlantsSchema = SchemaFactory.createForClass(Plants);

