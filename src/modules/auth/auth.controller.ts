import { IsPublic } from 'src/shared/decorators/IsPublic';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @IsPublic()
  authenticate(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @Post('signup')
  @IsPublic()
  create(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }
}
