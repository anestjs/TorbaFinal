import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class LocalGuard extends AuthGuard('local')
{

canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
}


    // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    //     console.log('AuthGuard(local) : additional logic if needed');
        
    //     return super.canActivate(context);
    // }
}