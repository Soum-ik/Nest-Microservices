import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto } from '../dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authClient: ClientProxy
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication || context.switchToHttp().getRequest().headers?.authorization;
    console.log('jwt getting: ', jwt);
  
    if (!jwt) return false;
    return this.authClient.send<UserDto>('authenticate', { Authentication: jwt }).pipe(
      tap((response) => {
        console.log(response, 'response from authenticate guard');
        return (context.switchToHttp().getRequest().user = response);
      }),
      map(() => true)
    );
  }
}
