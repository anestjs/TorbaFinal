import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { RecommendationModel, RecommendationSchema } from './recommendations.schema';
import { CropSchema } from '../crop-data/crop.schema';
import { UserSchema } from '../users/user.schema';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: RecommendationModel.name, schema: RecommendationSchema },
            { name: 'Crop', schema: CropSchema },
            { name: 'User', schema: UserSchema },
        ]),
        WeatherModule,
    ],
    controllers: [RecommendationsController],
    providers: [RecommendationsService],
    exports: [RecommendationsService], 
})
export class RecommendationsModule {}
