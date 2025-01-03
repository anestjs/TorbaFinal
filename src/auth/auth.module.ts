import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{ name:'users' , schema: UserSchema}]),
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret : 'secret',
      signOptions: {expiresIn:'1h'},
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy,JwtStrategy,UsersService],
  
})
export class AuthModule {}
