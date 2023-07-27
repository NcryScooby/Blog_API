import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const ActiveUserRoleId = createParamDecorator<undefined>(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const roleId = request.roleId;

    if (!roleId) throw new UnauthorizedException();

    return roleId;
  },
);
