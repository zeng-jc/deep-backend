export enum cmsStatusCode {
  SUCCESS = '200',
  /** 用户状态码 **/
  UNKNOWN_ERROR = '10000', //未知错误
  USER_ID_INVALID = '100001', //用户id无效
  /** 权限状态码 **/
  PERMISSION_EXIST = '200001', //权限已存在
  PERMISSION_NOT_EXIST = '200002', // 权限不存在
  /** 角色状态码 **/
  ROLE_EXIST = '300001', //权限已存在
}
