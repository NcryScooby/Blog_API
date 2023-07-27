import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
