INSERT INTO deep.tbl_avatar (originalname,filename,encoding,minitype,`size`,`path`,createAt,updateAt,userId) VALUES
	 ('avatar.jpg','95633947e39f5926bee342d32ed51a3c','7bit','image/jpeg','59927','5926bee342d32ed51a3c.jpg','2023-12-18 09:28:02','2023-12-18 09:28:04',1);
INSERT INTO deep.tbl_moment (status,content,createAt,updateAt,userId,images,video) VALUES
	 ('0','666','2024-01-20 21:22:59.217039','2024-01-20 21:22:59.217039',1,NULL,NULL),
	 ('0','666','2024-01-20 21:27:11.411293','2024-01-20 21:27:11.411293',1,NULL,NULL),
	 ('0','666','2024-01-20 21:30:21.002948','2024-01-20 21:30:21.002948',1,NULL,NULL);
INSERT INTO deep.tbl_moment_label (name,createAt,updateAt) VALUES
	 ('123','2024-01-20 19:36:02.495711','2024-01-20 19:36:02.495711'),
	 ('222','2024-01-20 19:39:34.785589','2024-01-20 19:39:34.785589');
INSERT INTO deep.tbl_permission (name,`desc`,createAt,updateAt) VALUES
	 ('create','创建权限','2023-12-23 17:49:09.848291','2023-12-23 17:49:09.848291'),
	 ('update','更新权限','2023-12-23 18:17:45.396137','2023-12-23 18:17:45.396137'),
	 ('query','查询权限','2023-12-23 19:30:46.691026','2023-12-23 19:30:46.691026'),
	 ('delete','删除权限','2024-01-20 21:56:32.228345','2024-01-20 21:56:32.228345');
INSERT INTO deep.tbl_role (name,updateAt,`desc`,createAt) VALUES
	 ('admin','2024-01-21 12:37:49.677124','管理员','2023-12-23 17:50:32.934344'),
	 ('普通用户','2024-01-21 12:38:23.046335','无','2024-01-21 11:49:26.256443');
INSERT INTO deep.tbl_role_permission_relation (tblRoleId,tblPermissionId) VALUES
	 (1,1),
	 (1,2),
	 (1,3);
INSERT INTO deep.tbl_user (username,password,nickname,email,bio,`level`,birthday,school,major,`position`,github,createAt,updateAt,gender,status,phone) VALUES
	 ('123456','123456','231234','1231231223@qq.com','123123123',1,'2000-07-22','123213','123213','233','xxx','2023-12-16 23:23:41.773728','2024-01-09 09:41:00.767741','1','1','1234566'),
	 ('12223456','Wa123231@','nick','1231223@qq.com','',1,NULL,'','','','','2023-12-17 11:39:48.129221','2023-12-17 11:39:48.129221','1','1',''),
	 ('213123','12345','xxx','123123@qq.com','',1,NULL,'','','','','2023-12-24 21:32:20.157905','2024-01-21 12:37:58.990967','2','1',''),
	 ('213214123','12345','xxx','123213123@qq.com','',1,NULL,'','','','','2024-01-07 21:36:04.177533','2024-01-21 12:37:58.996543','2','1','');
INSERT INTO deep.tbl_user_role_relation (tblUserId,tblRoleId) VALUES
	 (1,1);
