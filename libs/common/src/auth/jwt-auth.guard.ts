import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authClient: ClientProxy
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication || context.switchToHttp().getRequest().headers?.authorization;
    if (!jwt) return false;
    return this.authClient.send('authenticate', { Authentication: jwt }).pipe(
      tap((response) => {
        context.switchToHttp().getRequest().user = response;
      }),
      map(() => true)
    );
  } 
}
