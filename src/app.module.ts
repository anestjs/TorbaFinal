/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantsModule } from './plants/plants.module';

import { UsersModule } from './users/users.module';


import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [PlantsModule,UsersModule,
    MongooseModule.forRoot('mongodb+srv://ayaqadry:1234@torba.vuur8.mongodb.net/testing_db'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule {}
