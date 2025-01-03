/* eslint-disable prettier/prettier */
import { Controller, Session ,Post, Body, Get, Render, BadRequestException,Redirect } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from "bcrypt";
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get('signup')
    @Render('signup')
    getSignupPage( ) {
        return "";
    }

    @Get('landingpage')
    @Render('index')
    getLandingPage() {
        return '';
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
        @Body('soil_ph') soil_ph: number,
        
    ) {
        

        const existing_user = await this.userService.findUserByEmail(email);
        if (existing_user) {
            throw new Error("");
        }
        await this.userService.signup(full_name,email,phone,password,longitude,latitude,land_area,soil_ph)  ;
        
    }


    @Get('login')
    @Render('login')
    getLoginPage() {
        return '';
    }


  

//     @Get('check-session')
// checkSession(@Session() session: Record<string, any>) {
//   if (session.user) {
//     return { message: 'Session is set', user: session.user };
//   } else {
//     return { message: 'No session found' };
//   }
// }



    @Post('login')
    @Redirect('users/dashboard') // Default redirect in case no return value overrides it
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Session() session: Record<string, any>, 
    ) {
        const user = await this.userService.findUserByEmail(email);

        if (!user) {
            throw new BadRequestException('Invalid email.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password.');
        }

        session.user = { id: user.id, email: user.email };

        // Redirect explicitly (overrides the default @Redirect path if needed)
        return { url: 'users/dashboard' };
    }


    


 
    }

