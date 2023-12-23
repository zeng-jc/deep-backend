import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  name!: string;
  @MaxLength(255)
  desc?: string;
}
