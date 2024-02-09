import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MulterUploadImage } from '@utils/MulterUploadImage';
import { AuthService } from '@modules/auth/auth.service';
import { SignUpDto } from '@modules/auth/dto/signup.dto';
import { SignInDto } from '@modules/auth/dto/signin.dto';
import { IsPublic } from '@decorators/IsPublic';
import { env } from '@src/shared/config/env';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @IsPublic()
  authenticate(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signup')
  @IsPublic()
  @UseInterceptors(MulterUploadImage('avatar'))
  create(
    @Body() signUpDto: SignUpDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatar = `${env.AWS_CLOUDFRONT_URL}/${file.filename}`;

    if (!avatar) throw new BadRequestException('Avatar is required');

    return this.authService.signUp({
      ...signUpDto,
      avatar,
    });
  }
}
