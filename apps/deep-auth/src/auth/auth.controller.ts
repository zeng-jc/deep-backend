import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { AuthService } from './auth.service';
import { HeadersAuthDto } from './dto/headers-auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signin')
  signin(@Body() signinAuthData: SigninAuthDto) {
    return this.authService.signin(signinAuthData);
  }

  @Post('refresh-token')
  refreshToken(@Headers() headers: HeadersAuthDto) {
    const token = headers.authorization?.split(' ')[1];
    return this.authService.refreshToken(token);
  }

  @Post('verify-token')
  verifyToken(@Headers() headers: HeadersAuthDto) {
    const token = headers.authorization?.split(' ')[1];
    return this.authService.verify(token);
  }
}
