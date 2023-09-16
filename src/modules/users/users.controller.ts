import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsPublic } from '@src/shared/decorators/IsPublic';
import { ActiveUserId } from '@decorators/ActiveUserId';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@ActiveUserId() userId: string) {
    return this.usersService.getUserById(userId);
  }

  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }

  @Post('validate-email')
  @IsPublic()
  validateEmail(@Body('email') email: string) {
    return this.usersService.validateEmail(email);
  }

  @Post('validate-username')
  @IsPublic()
  validateUsername(@Body('username') username: string) {
    return this.usersService.validateUsername(username);
  }
}
