import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
