import { IsArray, IsNotEmpty } from 'class-validator';

export class AssignPermissionRoleDto {
  @IsNotEmpty()
  roleId!: number;
  @IsNotEmpty()
  @IsArray()
  permissionIds!: number[];
}
