import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
