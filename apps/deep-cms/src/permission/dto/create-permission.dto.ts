import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  name!: string;
  @IsNotEmpty()
  menuId: number;
  @MaxLength(255)
  desc?: string;
}
