import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
