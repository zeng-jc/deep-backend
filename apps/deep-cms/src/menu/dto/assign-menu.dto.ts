import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignMenuDto {
  @IsNotEmpty()
  @IsNumber()
  roleId!: number;
  @IsNotEmpty()
  @IsArray()
  menuIds!: number[];
}
