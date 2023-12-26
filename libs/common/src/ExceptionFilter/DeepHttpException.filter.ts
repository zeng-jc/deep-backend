import { HttpException, HttpStatus } from '@nestjs/common';
import { CmsErrorCode } from './ResStatusCode/cms.ErrorCode';
import { CmsErrorMsg } from './ResStatusCode/cms.ErrorMsg';

export class DeepHttpException extends HttpException {
  private errMsg: CmsErrorMsg;
  private errCode: CmsErrorCode;

  constructor(
    errMsg: CmsErrorMsg,
    errCode: CmsErrorCode,
    // 建议初始化，否则调用DeepHttpException需要传入此参数
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    super(errMsg, statusCode);
    this.errMsg = errMsg;
    this.errCode = errCode;
  }

  getErrCode(): CmsErrorCode {
    return this.errCode;
  }

  getErrMsg(): string {
    return this.errMsg;
  }
}
