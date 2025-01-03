// recommendations.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { RecommendationItem } from './recommendations-types';

@Schema()
export class RecommendationModel {
    @Prop({ required: true, index: true })
    landId: string;

    @Prop({ required: true })
    userId: string;

    @Prop([{
        cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
        score: { type: Number, required: true },
        reasons: { type: [String], required: true },
        lastUpdated: { type: Date, default: Date.now }
    }])
    recommendations: RecommendationItem[];
    
}

export type RecommendationDocument = RecommendationModel & Document;
export const RecommendationSchema = SchemaFactory.createForClass(RecommendationModel);