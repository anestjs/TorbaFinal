import { Schema, Document } from 'mongoose';

export const PlantIdSchema = new Schema(
  {
    plant_id: { type: String, required: true },  
  },
  {
    collection: 'plant_ids',  
  },
);

export interface PlantId extends Document {
  plant_id: string;   
}
