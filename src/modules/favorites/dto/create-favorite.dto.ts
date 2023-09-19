import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFavoriteDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string;
}
