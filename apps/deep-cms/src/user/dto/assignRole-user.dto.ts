import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRoleUserDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;
  @IsNotEmpty()
  @IsNumber()
  roleId!: number;
}
