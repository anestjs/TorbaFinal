/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Render, BadRequestException,Redirect } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from "bcrypt";


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get('signup')
    @Render('signup')
    getSignupPage( ) {
        return "";
    }
    
    //http status code ; 302-> temporarily redirect
    @Post('signup')
    @Redirect('/users/login', 302)
    async signup(
        @Body('full_name') full_name: string,
        @Body('email') email: string,
        @Body('phone') phone: string,
        @Body('password') password: string,
        @Body('longitude') longitude: number,
        @Body('latitude') latitude: number,
        @Body('land_area') land_area: number,
    ) {
        

        const existing_user = await this.userService.findUserByEmail(email);
        if (existing_user) {
            throw new Error("");
        }
        await this.userService.signup(full_name,email,phone,password,longitude,latitude,land_area)  ;
        
    }


    @Get('login')
    @Render('login')
    getLoginPage() {
        return '';
    }
    @Post('login')
    @Redirect('/plants/1', 302) // Default redirect in case no return value overrides it
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        const user = await this.userService.findUserByEmail(email);

        if (!user) {
            throw new BadRequestException('Invalid email.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password.');
        }

        // Redirect explicitly (overrides the default @Redirect path if needed)
        return { url: '/plants/2' };
    }
    }

