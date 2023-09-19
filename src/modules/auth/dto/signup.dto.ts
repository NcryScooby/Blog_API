import { IsValidUsername } from '../../../shared/validators/IsValidUsername';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
  Validate,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Validate(IsValidUsername)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  avatar: any;

  @IsNotEmpty()
  @IsUUID()
  jobId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  countryOfBirth: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  bio: string;
}
