import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSavedPostDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string;
}
