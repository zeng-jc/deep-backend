import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { AuthService } from './auth.service';
import { HeadersAuthDto } from './dto/headers-auth.dto';
import { EmailVerificationCodeDto } from './dto/email-verfication-code.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // 账号密码登录
  @Post('signin')
  signinAccount(@Body() signinAuthData: SigninAuthDto) {
    return this.authService.signinAccount(signinAuthData);
  }

  // 验证码登录
  @Post('signin-verification-code')
  signinVerificationCode(@Body() emailVerificationCodeDto: EmailVerificationCodeDto) {
    return this.authService.signinVerificationCode(emailVerificationCodeDto);
  }

  // 用户注册
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  // 判断邮箱是否注册
  @Post('email-is-exist/:email')
  emailIsExist(@Param('email') email: string) {
    return this.authService.emailExist(email);
  }

  // 判断用户是否存在
  @Post('user-is-exist/:user')
  userIsExist(@Param('user') user: string) {
    return this.authService.userExist(user);
  }

  // 获取邮箱验证码
  @Post('email-verify-code/:email')
  getEmailVerifyCode(@Param('email') email: string) {
    return this.authService.getEmailVerifyCode(email);
  }

  // 验证码检查接口
  @Post('check-verification-code')
  checkEmailVerificationCode(@Body() emailVerificationCodeDto: EmailVerificationCodeDto) {
    return this.authService.checkEmailVerificationCode(emailVerificationCodeDto);
  }

  @Post('refresh-token')
  refreshToken(@Headers() headers: HeadersAuthDto) {
    const token = headers.authorization?.split(' ')[1];
    return this.authService.refreshToken(token);
  }

  @Post('verify-token')
  verifyToken(@Headers() headers: HeadersAuthDto) {
    const token = headers.authorization?.split(' ')[1];
    return this.authService.verifyToken(token);
  }
}
