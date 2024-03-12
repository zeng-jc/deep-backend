-- 创建菜单
INSERT INTO deep.menu (id,name,title,`path`,icon,createAt,updateAt,component,link,`order`,parentId) VALUES
	 (1,'home','首页','/home/index','HomeFilled','2024-02-22 09:36:48.975092','2024-02-28 06:46:31.405894','/home/index',NULL,NULL,NULL),
	 (2,'stats','数据统计','/stats','DataBoard','2024-02-22 09:36:48.975092','2024-02-28 06:48:12.412514','/stats/index',NULL,NULL,NULL),
	 (3,'user','用户管理','/user','User','2024-02-28 02:29:14.175838','2024-02-28 06:44:40.699412',NULL,NULL,NULL,NULL),
	 (4,'userList','用户列表','/user/userList','Menu','2024-02-28 02:29:14.239855','2024-02-28 06:48:37.287999','/user/userList/index',NULL,NULL,3),
	 (5,'userFeedback','用户反馈','/user/userFeedback','Menu','2024-02-28 02:35:53.893017','2024-02-28 06:48:37.349086','/user/userFeedback/index',NULL,NULL,3),
	 (6,'article','文章管理','/article','Document','2024-02-28 01:53:12.773258','2024-02-28 06:47:15.116549','',NULL,NULL,NULL),
	 (7,'articleList','文章列表','/article/articleList','Menu','2024-02-28 01:57:36.051796','2024-02-28 06:48:42.594111','/article/articleList/index',NULL,NULL,6),
	 (8,'articleComment','文章评论','/article/articleComment','Menu','2024-02-28 02:12:40.759089','2024-02-28 06:48:42.655547','/article/articleComment/index',NULL,NULL,6),
	 (9,'articleLabel','文章标签','/article/articleLabel','Menu','2024-02-28 02:12:40.824086','2024-02-28 06:48:42.760239','/article/articleLabel/index',NULL,NULL,6),
	 (10,'moment','动态管理','/moment','MagicStick','2024-02-28 02:16:52.373723','2024-02-28 06:54:07.780516',NULL,NULL,NULL,NULL),
	 (11,'momentList','动态列表','/moment/momentList','Menu','2024-02-28 02:16:52.436517','2024-02-28 06:48:47.075351','/moment/momentList/index',NULL,NULL,10),
	 (12,'momentComment','动态评论','/moment/momentComment','Menu','2024-02-28 02:16:52.500150','2024-02-28 06:48:47.135659','/moment/momentComment/index',NULL,NULL,10),
	 (13,'momentLabel','动态标签','/moment/momentLabel','Menu','2024-02-28 02:19:27.161734','2024-02-28 06:48:47.255719','/moment/momentLabel/index',NULL,NULL,10),
	 (14,'questionAnswer','问答管理','/questionAnswer','QuestionFilled','2024-02-28 02:21:32.667130','2024-02-28 06:54:36.842380',NULL,NULL,NULL,NULL),
	 (15,'questionAnswerList','问答列表','/questionAnswer/questionAnswerList','Menu','2024-02-28 02:22:22.837577','2024-02-28 06:54:36.902248','/questionAnswer/questionAnswerList/index',NULL,NULL,14),
	 (16,'system','系统管理','/system','Tools','2024-02-28 02:27:54.582931','2024-02-28 06:55:31.997014',NULL,NULL,NULL,NULL),
	 (17,'role','角色管理','/system/role','Menu','2024-02-28 02:39:36.652607','2024-02-28 06:48:56.707003','/system/role/index',NULL,NULL,16),
	 (18,'permission','权限管理','/system/permission','Menu','2024-02-28 02:39:36.714687','2024-02-28 06:48:56.768229','/system/permission/index',NULL,NULL,16),
	 (19,'menu','菜单管理','/system/menu','Menu','2024-02-28 02:39:36.777877','2024-02-28 06:48:56.871024','/system/menu/index',NULL,NULL,16),
	 (20,'link','外部链接','/link','Paperclip','2024-02-22 09:37:55.088743','2024-02-28 06:55:32.057971',NULL,NULL,NULL,NULL),
	 (21,'github','github','/link/github','Menu','2024-02-22 09:38:49.018395','2024-02-28 06:48:56.938679',NULL,'https://github.com/zeng-jc',NULL,20),
	 (22,'juejin','掘金','/link/juejin','Menu','2024-02-22 09:39:40.602020','2024-02-28 06:48:57.001155',NULL,'https://juejin.cn/user/1548551276737191',NULL,20);

-- 创建用户
INSERT INTO deep.user (username,password,nickname,email,bio,`level`,birthday,school,major,`position`,github,createAt,updateAt,gender,status,phone) VALUES
	 ('superAdmin','123456','231234','1231231223@qq.com','123123123',1,'2000-07-22','123213','123213','233','xxx','2023-12-16 23:23:41.773728','2024-01-09 09:41:00.767741','1','1','1234566'),
	 ('admin','123456','nick','1231223@qq.com','',1,NULL,'','','','','2023-12-17 11:39:48.129221','2023-12-17 11:39:48.129221','1','1',''),
	 ('213123','12345','xxx','123123@qq.com','',1,NULL,'','','','','2023-12-24 21:32:20.157905','2024-01-21 12:37:58.990967','2','1',''),
	 ('213214123','12345','xxx','123213123@qq.com','',1,NULL,'','','','','2024-01-07 21:36:04.177533','2024-01-21 12:37:58.996543','2','1','');

-- 创建角色
INSERT INTO deep.`role` (name,`desc`,createAt,updateAt,status) VALUES
	 ('superAdmin','只有超级管理员才能对角色、权限、菜单进行处理','2023-12-23 17:50:32.934344','2024-03-10 10:24:33.553973','1'),
	 ('admin','普通管理员','2024-01-21 11:49:26.256443','2024-03-10 10:24:45.564081','1');

-- 创建权限
INSERT INTO deep.permission (name,`desc`,menuId,createAt,updateAt) VALUES
	 ('query-stats','查询统计数据',2,'2024-03-10 09:07:28.115841','2024-03-10 09:07:28.115841'),
	 ('query-user-list','查询用户列表',3,'2023-12-23 18:17:45.396137','2024-03-10 06:44:06.602369'),
	 ('create-user','创建用户',3,'2023-12-23 17:49:09.848291','2024-03-10 06:44:06.542402'),
	 ('query-user','查询用户',3,'2023-12-23 19:30:46.691026','2024-03-10 06:44:06.662398'),
	 ('update-user','更新用户',3,'2024-01-20 21:56:32.228345','2024-03-10 06:44:06.720873'),
	 ('delete-user','删除用户',3,'2024-03-10 06:45:03.614607','2024-03-10 06:45:03.614607'),
	 ('change-user-status','设置用户状态',3,'2024-03-10 06:48:29.905507','2024-03-10 06:48:29.905507'),
	 ('create-role','创建角色',17,'2024-03-10 09:07:28.115841','2024-03-10 09:07:28.115841'),
	 ('assign-role','分配角色',17,'2024-03-10 09:07:28.115841','2024-03-10 09:07:28.115841'),
	 ('query-role-list','查询角色列表',17,'2024-03-10 10:07:02.143889','2024-03-10 10:07:02.143889'),
	 ('query-role','查询角色',17,'2024-03-10 10:07:02.202006','2024-03-10 10:07:02.202006'),
	 ('update-role','更新角色',17,'2024-03-10 10:07:02.259413','2024-03-10 10:07:02.259413'),
	 ('delete-role','删除角色',17,'2024-03-10 10:41:49.859854','2024-03-10 10:41:49.859854'),
	 ('create-permission','创建权限',18,'2024-03-10 10:22:00.891893','2024-03-10 10:22:00.891893'),
	 ('assign-permission','分配权限',18,'2024-03-10 10:22:00.952237','2024-03-10 10:22:00.952237'),
	 ('find-permission-list','查询权限列表',18,'2024-03-10 10:22:01.011715','2024-03-10 10:22:01.011715'),
	 ('find-permission','查询权限',18,'2024-03-10 10:22:01.070733','2024-03-10 10:22:01.070733'),
	 ('update-permission','更新权限',18,'2024-03-10 10:22:01.130741','2024-03-10 10:22:01.130741'),
	 ('delete-permission','删除权限',18,'2024-03-10 10:22:01.189736','2024-03-10 10:22:01.189736'),
	 ('create-menu','创建菜单',19,'2024-03-10 10:51:30.066849','2024-03-10 10:51:30.066849'),
	 ('get-menu','获取菜单',19,'2024-03-10 10:51:30.131835','2024-03-10 10:51:30.131835'),
	 ('update-menu','更新菜单',19,'2024-03-10 10:51:30.194866','2024-03-10 10:51:30.194866'),
	 ('delete-menu','删除菜单',19,'2024-03-10 10:51:30.256359','2024-03-10 10:51:30.256359'),
	 ('assign-menu','给角色分配菜单',19,'2024-03-10 10:51:30.318336','2024-03-10 10:51:30.318336');

-- 给用户分配角色
INSERT INTO deep.user_role_relation (userId,roleId) VALUES
	 (1,1);

-- 给角色分配权限
INSERT INTO deep.role_permission_relation (roleId,permissionId) VALUES
	 (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24);
	
-- 给角色分配菜单
INSERT INTO deep.role_menu_relation (roleId,menuId) VALUES
	 (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22);
