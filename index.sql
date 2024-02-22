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


