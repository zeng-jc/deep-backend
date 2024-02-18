import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMsg } from './resStatusCode';

type ErrMsg = ErrorMsg;
type ErrCode = ErrorCode;

export class DeepHttpException extends HttpException {
  private errMsg: ErrMsg;
  private errCode: ErrCode;

  constructor(
    errMsg: ErrMsg,
    errCode: ErrCode,
    // 建议初始化，否则调用DeepHttpException需要传入此参数
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    super(errMsg, statusCode);
    this.errMsg = errMsg;
    this.errCode = errCode;
  }

  getErrCode(): ErrCode {
    return this.errCode;
  }

  getErrMsg(): ErrMsg {
    return this.errMsg;
  }
}
