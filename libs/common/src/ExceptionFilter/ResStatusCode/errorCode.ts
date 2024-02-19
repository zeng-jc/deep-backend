export enum ErrorCode {
  /** auth状态码 */
  TOKEN_INVALID = '10000',
  INVALID_IDENTITY_INFORMATION = '10001',
  YOU_DO_NOT_OWN_THIS_RESOURCE = '10002',
  /** 用户状态码 **/
  UNKNOWN_ERROR = '100001', //未知错误
  USER_ID_INVALID = '100002', //用户id无效
  USER_NOT_EXIST = '100003',
  USER_EXIST = '100004',
  EMAIL_EXIST = '100005',
  AVATAR_UNSUPPORTED_FILE_TYPE = '100006',
  /** 权限状态码 **/
  PERMISSION_DENIED = '200001', //权限不足
  PERMISSION_EXIST = '200002', //权限已存在
  PERMISSION_NOT_EXIST = '200003', // 权限不存在
  /** 角色状态码 **/
  ROLE_ACCESS_PROHIBITED = '300001', //角色禁止访问
  ROLE_EXIST = '300002', //角色已存在
  ROLE_NOT_EXIST = '300003', //角色不存在
  /** 动态状态码 */
  MOMENT_PARAMETER_VALUE_ERROR = '400001',
  MOMENT_UNSUPPORTED_IMAGE_FILE_TYPE = '400002',
  MOMENT_UNSUPPORTED_VIDEO_FILE_TYPE = '400003',
  MOMENT_NOT_EXIST = '400004',
  REPLY_MOMENT_NOT_EXIST = '400005',
  /** 文章状态码 */
  ARTICLE_PARAMETER_VALUE_ERROR = '500001',
  /** 数据库错误 */
  DATABASE_HANDLE_ERROR = '600001',
}