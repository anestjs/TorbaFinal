// recommendation-types.ts - For all interfaces and types
import { Crop } from "src/crop-data/crop.schema";
import { Types } from 'mongoose';

// Interface for a single recommendation result (used in service calculations)
export interface RecommendationResult {
    crop: Crop;
    score: number;
    reasons: string[];
}

// Interface for a stored recommendation item (MongoDB subdocument)
export interface RecommendationItem {
    cropId: Types.ObjectId;
    score: number;
    reasons: string[];
    lastUpdated: Date;
}

// Interface for the complete recommendation document (MongoDB document)
export interface RecommendationDocument {
    landId: string;
    userId: string;
    recommendations: RecommendationItem[];
}