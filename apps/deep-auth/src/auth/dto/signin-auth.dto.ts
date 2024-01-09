import { IsNotEmpty, Length } from 'class-validator';

export class SigninAuthDto {
  @IsNotEmpty()
  @Length(3, 20)
  username!: string;
  @IsNotEmpty()
  @Length(3, 20)
  password!: string;
}
