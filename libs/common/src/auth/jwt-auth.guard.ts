import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AUTH_SERVICE } from "../constants/services";
import { ClientProxy } from W"@nestjs/microservices";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor( 
        @Inject(AUTH_SERVICE)
        private readonly authClient: ClientProxy, // Assuming AuthService is defined and imported correctly 
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
        if (!jwt) return false;
         
        return true; // Default return value if jwt exists
    }
}