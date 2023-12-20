import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionCustom } from './httpExceptionCustom.filter';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (exception instanceof HttpExceptionCustom) {
      response.status(status).json({
        code: exception.getErrCode(),
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.getErrMsg(),
      });
      return;
    }

    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
