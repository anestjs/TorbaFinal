import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { log } from "console";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService:AuthService)
    {
        super();
    }
    validate(email:string,password:string)
    {
        console.log('inside local strategy validate');
            const user = this.authService.validateUser({email,password});


            if(!user) throw new UnauthorizedException();
            return user;
    }
}