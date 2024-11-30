/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;
    @Prop({ required: true })
    full_name: string;
    @Prop({ required: true })
    phone: string;
    @Prop({ required: true })
    longitude: number;
    @Prop({ required: true })
    latitude: number;
    @Prop({ default: Date.now })
    createdAt: Date;
}


export const UserSchema = SchemaFactory.createForClass(User);
