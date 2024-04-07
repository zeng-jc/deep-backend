import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username!: string;
  @IsNotEmpty()
  password!: string;
  @IsNotEmpty()
  nickname!: string;
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  gender?: number;
  status?: number;
  bio?: string;
  level?: number;
  birthday?: Date;
  phone?: string;
  school?: string;
  major?: string;
  position?: string;
  github?: string;
  createTime?: Date;
  updateTime?: Date;
}
