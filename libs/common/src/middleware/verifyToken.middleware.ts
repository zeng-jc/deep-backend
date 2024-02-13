import { AuthErrorCode, AuthErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';
import { SecretKeyService } from '@app/common/secretKey/secretKey.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
// TODO
import { TokenPayload } from '../interface';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class verifyTokenMiddleware implements NestMiddleware {
  constructor(private readonly secretKey: SecretKeyService) {}
  use(req: Request, _res: Response, next: (error?: unknown) => void) {
    const token = req.headers.authorization?.split(' ')[1];
    const tokenPayload = this.verify(token);
    req.headers.authorization = JSON.stringify(tokenPayload);
    next();
  }
  verify(token: string): TokenPayload {
    let result;
    try {
      result = jwt.verify(token, this.secretKey.getPublicKey(), {
        algorithms: ['RS256'],
      });
    } catch (error) {
      throw new DeepHttpException(AuthErrorMsg.TOKEN_INVALID, AuthErrorCode.TOKEN_INVALID);
    }
    return result;
  }
}
