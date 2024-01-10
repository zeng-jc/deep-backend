// import {
//   AuthErrorCode,
//   AuthErrorMsg,
//   DeepHttpException,
// } from '@app/common/exceptionFilter';
// import { Injectable, NestMiddleware } from '@nestjs/common';
// // TODO
// import { TokenPayload } from 'apps/deep-auth/src/common/interface/tokenPayload.interface';
// import * as jwt from 'jsonwebtoken';

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   use(req: any, res: any, next: (error?: any) => void) {}
//   verify(token: string): TokenPayload {
//     let result;
//     try {
//       result = jwt.verify(token, this.PUBLIC_KEY, { algorithms: ['RS256'] });
//     } catch (error) {
//       throw new DeepHttpException(
//         AuthErrorMsg.TOKEN_INVALID,
//         AuthErrorCode.TOKEN_INVALID,
//       );
//     }
//     return result;
//   }
// }
