/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Render } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get('signup')
    @Render('signup')
    getSignupPage( ) {
        return "";
    }
    @Post('signup')
    async signup(
        @Body('full_name') full_name: string,
        @Body('email') email: string,
        @Body('phone') phone: string,
        @Body('password') password: string,
        @Body('longitude') longitude: number,
        @Body('latitude') latitude: number,) {
        

        const existing_user = await this.userService.findUserByEmail(email);
        if (existing_user) {
            throw new Error("");
        }
        const new_user = await this.userService.signup(full_name,email,phone,password,longitude,latitude)  ;
        
        return {message:"success signup",new_user}; 
    }
    }

