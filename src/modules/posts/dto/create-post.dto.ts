import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  content: string;

  @IsString()
  image?: string;

  @IsDateString()
  @IsNotEmpty()
  createdAt: Date;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
