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

  image: any;

  @IsOptional()
  @IsString({ each: true })
  tags: string[];

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
