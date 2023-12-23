import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  name!: string;
  @MaxLength(255)
  desc?: string;
  permissionIds?: number[];
}
