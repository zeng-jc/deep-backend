import { HttpException, HttpStatus } from '@nestjs/common';
import { CmsErrorCode } from './ResStatusCode/cms.ErrorCode';
import { CmsErrorMsg } from './ResStatusCode/cms.ErrorMsg';
import { AuthErrorCode, AuthErrorMsg } from './ResStatusCode';

type ErrMsg = CmsErrorMsg | AuthErrorMsg;
type ErrCode = CmsErrorCode | AuthErrorCode;

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
