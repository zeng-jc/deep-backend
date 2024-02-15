import { IsArray, IsNotEmpty } from 'class-validator';

export class AssignPermissionDto {
  @IsNotEmpty()
  roleId!: number;
  @IsNotEmpty()
  @IsArray()
  permissionIds!: number[];
}
