export enum CmsErrorMsg {
  /** 用户状态码 **/
  UNKNOWN_ERROR = 'UNKNOWN ERROR', //未知错误
  USER_ID_INVALID = 'USER ID INVALID', //用户id无效
  USER_NOT_EXEITST = 'USER NOT EXEITST',
  /** 权限状态码 **/
  PERMISSION_DENIED = 'PERMISSION DENIED', //权限不足
  PERMISSION_EXIST = 'PERMISSION EXIST', //权限已存在
  PERMISSION_NOT_EXIST = 'PERMISSION_NOT EXIST', // 权限不存在
  /** 角色状态码 **/
  ROLE_ACCESS_PROHIBITED = 'ROLE ACCESS PROHIBITED', //角色禁止访问
  ROLE_EXIST = 'ROLE EXIST', //角色已存在
  ROLE_NOT_EXIST = 'ROLE NOT EXIST', //角色不存在
  /** 动态状态码 */
  COMMONET_PARAMETER_VALUE_ERROR = 'COMMONET PARAMETER VALUE ERROR',
  MOMENT_UNSUPPORTED_IMAGE_FILE_TYPE = 'MOMENT UNSUPPORTED IMAGE FILE TYPE',
  MOMENT_UNSUPPORTED_VIDEO_FILE_TYPE = 'MOMENT UNSUPPORTED VIDEO FILE TYPE',
  MOMENT_NOT_EXEITST = 'MOMENT NOT EXEITST',
  /** 文章状态码 */
  ARTICLE_PARAMETER_VALUE_ERROR = 'ARTICLE PARAMETER VALUE ERROR',
}
