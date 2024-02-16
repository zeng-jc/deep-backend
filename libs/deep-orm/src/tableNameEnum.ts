// 为什么要把表名写入枚举中，因为web端服务有一个guard，需要检查用户当前操作的资源是否属于自己
export enum tableNameEnum {
  user = 'user',
  user_role_relation = 'user_role_relation',
  role = 'role',
  role_menu_relation = 'role_menu_relation',
  role_permission_relation = 'role_permission_relation',
  menu = 'menu',
  permission = 'permission',
  article_comment = 'article_comment',
  article_label_relation = 'article_label_relation',
  article_label = 'article_label',
  article = 'article',
  moment_comment = 'moment_comment',
  moment_label_relation = 'moment_label_relation',
  moment_label = 'moment_label',
  moment = 'moment',
  moment_likes = 'moment_likes',
}
