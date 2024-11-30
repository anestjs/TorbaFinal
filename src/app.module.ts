/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantsModule } from './plants/plants.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    PlantsModule,
    UsersModule,
    MongooseModule.forRoot('mongodb+srv://ayaqadry:1234@torba.vuur8.mongodb.net/testing_db'),
    /*ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),  //   static files (HTML, CSS) are located
    }),*/
  ],
  controllers: [AppController],
  providers: [AppService],  
})
export class AppModule {}
