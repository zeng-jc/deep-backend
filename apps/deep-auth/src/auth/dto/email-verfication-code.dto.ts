import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class EmailVerificationCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsUUID()
  uuid: string;
  @IsNotEmpty()
  verificationCode: string;
}
