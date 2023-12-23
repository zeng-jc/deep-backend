import { HttpException, HttpStatus } from '@nestjs/common';
import { ResStatusCode } from './response.statusCode';

export class DeepHttpException extends HttpException {
  private errMsg: string;
  private errCode: ResStatusCode;

  constructor(
    errMsg: string,
    errCode: ResStatusCode,
    // 建议初始化，否则调用DeepHttpException需要传入此参数
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    super(errMsg, statusCode);
    this.errMsg = errMsg;
    this.errCode = errCode;
  }

  getErrCode(): ResStatusCode {
    return this.errCode;
  }

  getErrMsg(): string {
    return this.errMsg;
  }
}
