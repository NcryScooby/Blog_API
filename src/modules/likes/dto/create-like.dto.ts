import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLikeDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string;
}
