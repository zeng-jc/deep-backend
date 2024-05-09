import { IsNotEmpty, Length } from 'class-validator';

export class UpdatePasswordDto {
  @Length(3, 30)
  newPassword!: string;
  @IsNotEmpty()
  password!: string;
}
