import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signin')
  signin(@Body() signinAuthData: SigninAuthDto) {
    return this.authService.signin(signinAuthData);
  }
  @Post('verify-test')
  verifyTest() {}
}
