import { IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty()
  name!: string;
  @IsNotEmpty()
  title!: string;
  @IsNotEmpty()
  path: string;
  component!: string;
  parentId: number;
  link: string;
  order: number;
  icon: string;
}
