import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DeepHttpException } from './DeepHttpException.filter';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (exception instanceof DeepHttpException) {
      response.status(status).json({
        path: request.url,
        timestamp: new Date().toISOString(),
        message: exception.getErrMsg(),
        code: exception.getErrCode(),
      });
      return;
    }

    response.status(status).json({
      path: request.url,
      timestamp: new Date().toISOString(),
      message: exception.message,
      code: status,
    });
  }
}
