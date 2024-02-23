import { IsNotEmpty } from 'class-validator';
import { EmailVerificationCodeDto } from './email-verfication-code.dto';

export class CreateUserDto extends EmailVerificationCodeDto {
  @IsNotEmpty()
  username!: string;
  @IsNotEmpty()
  password!: string;
  @IsNotEmpty()
  nickname!: string;
}
