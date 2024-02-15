import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRoleDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;
  @IsNotEmpty()
  @IsArray()
  roleIds!: number[];
}
