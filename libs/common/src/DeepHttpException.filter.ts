import { HttpException, HttpStatus } from '@nestjs/common';
import { cmsStatusCode } from './ResStatusCode/cms.statusCode';

export class DeepHttpException extends HttpException {
  private errMsg: string;
  private errCode: cmsStatusCode;

  constructor(
    errMsg: string,
    errCode: cmsStatusCode,
    // 建议初始化，否则调用DeepHttpException需要传入此参数
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    super(errMsg, statusCode);
    this.errMsg = errMsg;
    this.errCode = errCode;
  }

  getErrCode(): cmsStatusCode {
    return this.errCode;
  }

  getErrMsg(): string {
    return this.errMsg;
  }
}
