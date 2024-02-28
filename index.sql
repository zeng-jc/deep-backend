INSERT INTO deep.user (username,password,nickname,email,bio,`level`,birthday,school,major,`position`,github,createAt,updateAt,gender,status,phone) VALUES
	 ('123456','123456','231234','1231231223@qq.com','123123123',1,'2000-07-22','123213','123213','233','xxx','2023-12-16 23:23:41.773728','2024-01-09 09:41:00.767741','1','1','1234566'),
	 ('12223456','Wa123231@','nick','1231223@qq.com','',1,NULL,'','','','','2023-12-17 11:39:48.129221','2023-12-17 11:39:48.129221','1','1',''),
	 ('213123','12345','xxx','123123@qq.com','',1,NULL,'','','','','2023-12-24 21:32:20.157905','2024-01-21 12:37:58.990967','2','1',''),
	 ('213214123','12345','xxx','123213123@qq.com','',1,NULL,'','','','','2024-01-07 21:36:04.177533','2024-01-21 12:37:58.996543','2','1','');

INSERT INTO deep.permission (name,`desc`,createAt,updateAt) VALUES
	 ('create','创建权限','2023-12-23 17:49:09.848291','2023-12-23 17:49:09.848291'),
	 ('update','更新权限','2023-12-23 18:17:45.396137','2023-12-23 18:17:45.396137'),
	 ('query','查询权限','2023-12-23 19:30:46.691026','2023-12-23 19:30:46.691026'),
	 ('delete','删除权限','2024-01-20 21:56:32.228345','2024-01-20 21:56:32.228345');
	
INSERT INTO deep.role (name,updateAt,`desc`,createAt) VALUES
	 ('admin','2024-01-21 12:37:49.677124','管理员','2023-12-23 17:50:32.934344'),
	 ('普通用户','2024-01-21 12:38:23.046335','无','2024-01-21 11:49:26.256443');
	
INSERT INTO deep.menu (name,title,`path`,component,link,`order`,icon,createAt,updateAt,parentId) VALUES
	 ('stats','数据统计','/stats','/stats/index',NULL,NULL,NULL,'2024-02-22 09:36:48.975092','2024-02-22 09:48:24',NULL),
	 ('link','外部链接','/link',NULL,NULL,NULL,NULL,'2024-02-22 09:37:55.088743','2024-02-22 09:44:54.418579',NULL),
	 ('github','github','/link/github','/link/github/index','https://github.com/zeng-jc',NULL,NULL,'2024-02-22 09:38:49.018395','2024-02-22 09:39:40.665035',2),
	 ('juejin','掘金','/link/juejin','/link/juejin/index','https://juejin.cn/user/1548551276737191',NULL,NULL,'2024-02-22 09:39:40.602020','2024-02-22 09:44:54.480399',2);


INSERT INTO deep.role_permission_relation (roleId,permissionId) VALUES
	 (1,1),
	 (1,2),
	 (1,3),
	 (1,4);
	
INSERT INTO deep.user_role_relation (userId,roleId) VALUES
	 (1,1);

INSERT INTO deep.role_menu_relation (roleId,menuId) VALUES
	 (1,1),
	 (1,2),
	 (1,3),
	 (1,4);



INSERT INTO deep.menu (id,name,title,`path`,icon,createAt,updateAt,component,link,`order`,parentId) VALUES
	 (1,'home','首页','/home/index',NULL,'2024-02-22 09:36:48.975092','2024-02-22 09:48:24','/home/index',NULL,NULL,NULL),
	 (2,'stats','数据统计','/stats/index',NULL,'2024-02-22 09:36:48.975092','2024-02-22 09:48:24','/stats/index',NULL,NULL,NULL),
	 (3,'user','用户管理','/user',NULL,'2024-02-28 02:29:14.175838','2024-02-28 02:29:14.175838',NULL,NULL,NULL,NULL),
	 (4,'userList','用户列表','/user/userList',NULL,'2024-02-28 02:29:14.239855','2024-02-28 02:29:14.239855','/user/userList/index',NULL,NULL,3),
	 (5,'userFeedback','用户反馈','/user/userFeedback',NULL,'2024-02-28 02:35:53.893017','2024-02-28 02:35:53.893017','/user/userFeedback/index',NULL,NULL,3),
	 (6,'article','文章管理','/article',NULL,'2024-02-28 01:53:12.773258','2024-02-28 01:53:12.773258','',NULL,NULL,NULL),
	 (7,'articleList','文章列表','/article/articleList',NULL,'2024-02-28 01:57:36.051796','2024-02-28 01:57:36.051796','/article/articleList/index',NULL,NULL,6),
	 (8,'articleComment','文章评论','/article/articleComment',NULL,'2024-02-28 02:12:40.759089','2024-02-28 02:12:40.759089','/article/articleComment/index',NULL,NULL,6),
	 (9,'articleLabel','文章标签','/article/articleLabel',NULL,'2024-02-28 02:12:40.824086','2024-02-28 02:19:27.237941','/article/articleLabel/index',NULL,NULL,6),
	 (10,'moment','动态管理','/moment',NULL,'2024-02-28 02:16:52.373723','2024-02-28 02:16:52.373723',NULL,NULL,NULL,NULL),
	 (11,'momentList','动态列表','/moment/momentList',NULL,'2024-02-28 02:16:52.436517','2024-02-28 02:19:27.361619','/moment/momentList/index',NULL,NULL,10),
	 (12,'momentComment','动态评论','/moment/momentComment',NULL,'2024-02-28 02:16:52.500150','2024-02-28 02:19:27.428023','/moment/momentComment/index',NULL,NULL,10),
	 (13,'momentLabel','动态标签','/moment/momentLabel',NULL,'2024-02-28 02:19:27.161734','2024-02-28 02:19:34.020299','/moment/momentLabel/index',NULL,NULL,10),
	 (14,'questionAnswer','问答管理','/questionAnswer',NULL,'2024-02-28 02:21:32.667130','2024-02-28 02:21:32.667130',NULL,NULL,NULL,NULL),
	 (15,'questionAnswerList','问答列表','/questionAnswer/questionAnswerList',NULL,'2024-02-28 02:22:22.837577','2024-02-28 02:22:22.837577','/questionAnswer/questionAnswerList/index',NULL,NULL,13),
	 (16,'system','系统管理','/system',NULL,'2024-02-28 02:27:54.582931','2024-02-28 02:27:54.582931',NULL,NULL,NULL,NULL),
	 (17,'role','角色管理','/system/role',NULL,'2024-02-28 02:39:36.652607','2024-02-28 02:39:36.652607','/system/role/index',NULL,NULL,16),
	 (18,'permission','权限管理','/system/permission',NULL,'2024-02-28 02:39:36.714687','2024-02-28 02:39:36.714687','/system/permission/index',NULL,NULL,16),
	 (19,'menu','菜单管理','/system/menu',NULL,'2024-02-28 02:39:36.777877','2024-02-28 02:39:36.777877','/system/menu/index',NULL,NULL,16),
	 (20,'link','外部链接','/link',NULL,'2024-02-22 09:37:55.088743','2024-02-22 09:44:54.418579',NULL,NULL,NULL,NULL),
	 (21,'github','github','/link/github',NULL,'2024-02-22 09:38:49.018395','2024-02-27 12:19:04.591809',NULL,'https://github.com/zeng-jc',NULL,20),
	 (22,'juejin','掘金','/link/juejin',NULL,'2024-02-22 09:39:40.602020','2024-02-27 12:19:04.648822',NULL,'https://juejin.cn/user/1548551276737191',NULL,20);

INSERT INTO deep.role_menu_relation (roleId,menuId) VALUES
	 (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16), (1,17),(1,18),(1,19),(1,20),(1,21),(1,22);
