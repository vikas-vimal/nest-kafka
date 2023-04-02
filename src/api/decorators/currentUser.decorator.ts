import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtUserObj => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
