/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('signup')
    async signup(@Body() body: {email: string, password: string}) {
        
        const {email, password} = body;

        const existing_user = await this.userService.findUserByEmail(email);
        if (existing_user) {
            throw new Error("");
        }
        const new_user = await this.userService.signup(email,password)  ;
        return {message:"success signup",new_user}; 
    }
}
