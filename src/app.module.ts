import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantsModule } from './plants/plants.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherService } from './weather/weather.service';
// import { RecommendationsService } from './recommendations/recommendations.service';
import { Plants, PlantsSchema } from './plants/plants.schema';
// import { Recomme-7.58ndationsController } from './recommendations/recommendations.controller';
import { CropDataModule } from './crop-data/crop-data.module';
import { WeatherModule } from './weather/weather.module';
import { WeatherController } from './weather/weather.controller';
import { HttpModule } from '@nestjs/axios';
import { RecommendationsModule } from './recommendations/recommendations.module';





/* eslint-disable prettier/prettier */
import { AuthModule } from './auth/auth.module';




@Module({
  imports: [
    PlantsModule,
    UsersModule, 
    MongooseModule.forRoot('mongodb+srv://ayaqadry:1234@torba.vuur8.mongodb.net/testing_db'),
    MongooseModule.forFeature([{ name: Plants.name, schema: PlantsSchema }]),
    CropDataModule,
    WeatherModule,
    HttpModule,
    AuthModule,
    RecommendationsModule,
    /*ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),  //   static files (HTML, CSS) are located
    }),*/
  ],
  controllers: [AppController,WeatherController ],
  providers: [AppService, WeatherService ],  
})
export class AppModule {}
