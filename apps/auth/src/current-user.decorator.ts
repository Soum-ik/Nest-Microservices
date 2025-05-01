import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from './users/models/users.schema';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
 