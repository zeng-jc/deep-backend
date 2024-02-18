import { Injectable } from '@nestjs/common';
import { SigninAuthDto } from './dto/signin-auth.dto';
// import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '@app/common';
import { ErrorCode, ErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';
import { DatabaseService } from '../database/database.service';
import { SecretKeyService } from '@app/common/secretKey/secretKey.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly secretKey: SecretKeyService,
  ) {}

  async signin(signinAuthData: SigninAuthDto) {
    const { username, password } = signinAuthData;

    const userInfo = await this.database.userRepo.findOne({
      where: {
        username,
        password,
      },
    });

    if (!userInfo) {
      throw new DeepHttpException(ErrorMsg.INVALID_IDENTITY_INFORMATION, ErrorCode.INVALID_IDENTITY_INFORMATION);
    }

    const TOKEN = this.createToken<TokenPayload>({
      id: userInfo.id,
      username: userInfo.username,
    });
    const data = {
      userInfo,
      token: TOKEN,
    };
    return data;
  }

  createToken<T>(payload: T): string {
    return jwt.sign(payload, this.secretKey.getPrivateKey(), {
      algorithm: 'RS256',
      expiresIn: 60 * 60 * 24,
    });
  }

  refreshToken(token: string) {
    const { id, username } = this.verify(token);
    return this.createToken<TokenPayload>({
      id,
      username,
    });
  }

  verify(token: string): TokenPayload {
    let result;
    try {
      result = jwt.verify(token, this.secretKey.getPublicKey(), {
        algorithms: ['RS256'],
      });
    } catch (error) {
      throw new DeepHttpException(ErrorMsg.TOKEN_INVALID, ErrorCode.TOKEN_INVALID);
    }
    return result;
  }
}
