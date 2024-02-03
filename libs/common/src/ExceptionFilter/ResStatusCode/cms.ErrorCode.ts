export enum CmsErrorCode {
  /** 用户状态码 **/
  UNKNOWN_ERROR = '10000', //未知错误
  USER_ID_INVALID = '100001', //用户id无效
  /** 权限状态码 **/
  PERMISSION_DENIED = '200001', //权限不足
  PERMISSION_EXIST = '200002', //权限已存在
  PERMISSION_NOT_EXIST = '200003', // 权限不存在
  /** 角色状态码 **/
  ROLE_ACCESS_PROHIBITED = '300001', //角色禁止访问
  ROLE_EXIST = '300002', //角色已存在
  ROLE_NOT_EXIST = '300003', //角色不存在
  /** 动态状态码 */
  COMMONET_PARAMETER_VALUE_ERROR = '400001',
  MOMENT_UNSUPPORTED_IMAGE_FILE_TYPE = '400002',
  MOMENT_UNSUPPORTED_VIDEO_FILE_TYPE = '400003',
  /** 文章状态码 */
  ARTICLE_PARAMETER_VALUE_ERROR = '500001',
}
