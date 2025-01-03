/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from "bcrypt";
import { Model } from 'mongoose';
import { User } from './user.schema';

 

@Injectable()
export class UsersService {
    findAll() {
      throw new Error('Method not implemented.');
    }
    
  


    constructor(@InjectModel('users') private readonly users: Model<User>) { }

    async signup(full_name: string, email: string, phone: string, password: string, longitude: number, latitude: number, land_area: number, soil_ph: number) {
        // const existing_user = await this.users.findOne({ email });  
        // if (existing_user) {
        //     throw new Error("Email is already in use");
        // }

        const hashed_password = await bcrypt.hash(password,10)

        

        // new user cree
        const new_user = new this.users({
            full_name,
            email,
            phone,
            password: hashed_password,
            lands: [{ latitude, longitude ,land_area,soil_ph}]   // Ajouter un premier land
        });
        await new_user.save();
        return { message : "user created" , user: new_user };
    }

    async findUserByEmail(email: string) {
        return this.users.findOne({ email }).exec();
    }


    async getAllLands() {
        return [
          {
            id: '1',
            latitude: 34.0522,
            longitude: -118.2437,
            land_area: 5000,
            soil_ph: 6.5,
          },
          {
            id: '2',
            latitude: 40.7128,
            longitude: -74.0060,
            land_area: 3000,
            soil_ph: 7.2,
          },
          {
            id: '3',
            latitude: 51.5074,
            longitude: -0.1278,
            land_area: 4500,
            soil_ph: 5.8,
          },
        ];
      }

      
}
