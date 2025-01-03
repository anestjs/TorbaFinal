import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor()
    {
        super({
            // jwtFromRequest : ExtractJwt.fromBodyField('access_token')
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration:false,
                secretOrKey:'secret',
        });
    }

     validate(payload:any)
        {       
            console.log('inside jwt strategy validate');
            console.log(payload);
            
                return payload;
        }



}