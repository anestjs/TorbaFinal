// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// @Schema()
// export class User extends Document {
//     @Prop({ required: true, unique: true })
//     email: string;

//     @Prop({ required: true })
//     password: string;
    
//     @Prop({ required: true })
//     full_name: string;
//     @Prop({ required: true })
//     phone: string;
    
//     @Prop({ required: true })
//     longitude: number;
//     @Prop({ required: true })
//     latitude: number;

//     @Prop({ required: true })
//     land_area: number;

//     @Prop({ default: Date.now })
//     createdAt: Date;
// }


// export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';




@Schema()
export class User extends Document {
    @Prop({ required: true })
    full_name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    password: string;

    // Définir le tableau "lands" contenant des objets avec latitude et longitude
    @Prop({
        type: [{
            // id: { type: String, required: true },
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
            land_area: { type: Number, required: true },
            soil_ph: { type: Number, required: true },
        }],
        default: [],
    })
    lands: { 
       // id: string; 
        _id?: any;
        latitude: number; 
        longitude: number; 
        land_area: number; 
        soil_ph: number; 
    }[];
    
}



export const UserSchema = SchemaFactory.createForClass(User);