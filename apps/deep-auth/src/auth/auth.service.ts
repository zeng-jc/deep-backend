import { Injectable } from '@nestjs/common';
import { SigninAuthDto } from './dto/signin-auth.dto';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { resolve } from 'path';
import { TokenPayload } from '../common/interface/tokenPayload.interface';
import {
  AuthErrorCode,
  AuthErrorMsg,
  DeepHttpException,
} from '@app/common/exceptionFilter';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  private PRIVATE_KEY: string = fs.readFileSync(
    resolve(__dirname, './secretKey/private.key'),
    'utf8',
  );

  private PUBLIC_KEY: string = fs.readFileSync(
    resolve(__dirname, './secretKey/public.key'),
    'utf8',
  );

  constructor(private readonly database: DatabaseService) {}

  async signin(signinAuthData: SigninAuthDto) {
    const { username, password } = signinAuthData;

    const userInfo = await this.database.userRepo.findOne({
      where: {
        username,
        password,
      },
    });

    if (!userInfo) {
      throw new DeepHttpException(
        AuthErrorMsg.TOKEN_INVALID,
        AuthErrorCode.TOKEN_INVALID,
      );
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
    return jwt.sign(payload, this.PRIVATE_KEY, {
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
      result = jwt.verify(token, this.PUBLIC_KEY, { algorithms: ['RS256'] });
    } catch (error) {
      throw new DeepHttpException(
        AuthErrorMsg.TOKEN_INVALID,
        AuthErrorCode.TOKEN_INVALID,
      );
    }
    return result;
  }
}
