import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcrypt";


const fakeUsers = [

    {
        id:1, email: 'anas',password :'password'
    },
    {
         id:2, email: 'aya',password :'password'
    },
]
@Injectable()
export class AuthService {

    constructor(private jwtService:JwtService,private readonly userService: UsersService){

    }

    async validateUser({email,password} : AuthPayloadDto){
        // const findUser = fakeUsers.find(
        //     (user) => user.email === email
        // );

        const findUser = await this.userService.findUserByEmail(email);
         // if(!findUser) return null;

        if (!findUser) {
            throw new BadRequestException('Invalid email.');
        }

                const isPasswordValid = await bcrypt.compare(password, findUser.password);
                if (!isPasswordValid) {
                    throw new BadRequestException('Invalid password.');
                }
                else{
                    const {password, ...user} = findUser;
                    return this.jwtService.sign(user);
                }
        // if(password === findUser.password) {
        //     const {password, ...user} = findUser;
        //      return this.jwtService.sign(user);
        // }

    }
}
