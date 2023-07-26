import {
  IsNotEmpty,
  IsOptional,
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

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tag: string[];

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
