export enum CmsErrorMsg {
  /** 用户状态码 **/
  UNKNOWN_ERROR = 'UNKNOWN ERROR', //未知错误
  USER_ID_INVALID = 'USER ID INVALID', //用户id无效
  /** 权限状态码 **/
  PERMISSION_DENIED = 'PERMISSION DENIED', //权限不足
  PERMISSION_EXIST = 'PERMISSION EXIST', //权限已存在
  PERMISSION_NOT_EXIST = 'PERMISSION_NOT EXIST', // 权限不存在
  /** 角色状态码 **/
  ROLE_EXIST = 'ROLE EXIST', //角色已存在
  /** 角色状态码 **/
  ROLE_NOT_EXIST = 'ROLE NOT EXIST', //角色已存在
}
