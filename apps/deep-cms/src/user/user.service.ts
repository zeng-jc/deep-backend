import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ArticleLikesEntity, MomentLikesEntity, UserEntity } from '@app/deep-orm/entities';
import { Like } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { CacheService } from '@app/deep-cache';
import { DeepHttpException, ErrorMsg, ErrorCode } from '@app/common/exceptionFilter';
import { EmailService } from '@app/common/emailService/email.service';
import { DatabaseService } from '../database/database.service';
import { extname } from 'path';
import { DeepMinioService } from '@app/deep-minio';
import { bucketNameEnum } from '@app/deep-minio/deep-minio.bucket-name';

const bucketName = bucketNameEnum.deepAvatar;

@Injectable()
export class UserService {
  constructor(
    private readonly database: DatabaseService,
    private readonly cacheService: CacheService,
    private readonly emailService: EmailService,
    private readonly deepMinioService: DeepMinioService,
  ) {}

  async emailExist(email: string, excludeId?: number): Promise<boolean> {
    let queryBuilder = this.database.userRepo.createQueryBuilder('user');
    queryBuilder = queryBuilder.where('user.email = :email', { email });
    if (excludeId) {
      queryBuilder = queryBuilder.andWhere('user.id != :id', { id: excludeId });
    }
    return !!(await queryBuilder.getCount());
  }

  async userExist(username: string, excludeId?: number): Promise<boolean> {
    let queryBuilder = this.database.userRepo.createQueryBuilder('user');
    queryBuilder = queryBuilder.where('user.username = :username', { username });
    if (excludeId) {
      queryBuilder = queryBuilder.andWhere('user.id != :id', { id: excludeId });
    }
    return !!(await queryBuilder.getCount());
  }
  // TODO: 密码加密
  async createUser(createUserDto: CreateUserDto) {
    const { username, password, nickname, gender, email, status, bio, level, birthday, phone, school, major, position, github } =
      createUserDto;
    if (await this.userExist(username)) throw new DeepHttpException(ErrorMsg.USER_EXIST, ErrorCode.USER_EXIST);
    if (await this.emailExist(email)) throw new DeepHttpException(ErrorMsg.EMAIL_EXIST, ErrorCode.EMAIL_EXIST);
    const user = new UserEntity();
    user.username = username;
    user.password = password;
    user.nickname = nickname;
    user.gender = gender;
    user.email = email;
    user.status = status;
    user.bio = bio;
    user.level = level;
    user.birthday = birthday;
    user.phone = phone;
    user.school = school;
    user.major = major;
    user.position = position;
    user.github = github;
    // 发送邮箱
    this.emailService.sendMailCreateUserNotify(email, nickname);
    return this.database.userRepo.save(user);
  }

  async findUserList(query: PaginationQueryDto) {
    let { keywords } = query;
    keywords = keywords ?? '';
    const pagenum = +query.pagenum;
    const pagesize = +query.pagesize;
    const [list, total] = await this.database.userRepo.findAndCount({
      relations: ['roles'],
      where: [
        {
          nickname: Like(`%${keywords}%`),
        },
        {
          username: Like(`%${keywords}%`),
        },
        {
          email: Like(`%${keywords}%`),
        },
      ],
      order: { id: 'DESC' },
      skip: pagesize * (pagenum - 1),
      take: pagesize,
    });
    await Promise.all(
      list.map(
        async (userEntity) =>
          (userEntity.avatar = userEntity.avatar && (await this.deepMinioService.getFileUrl(userEntity.avatar, bucketName))),
      ),
    );
    return {
      list,
      total,
    };
  }

  async findOneUser(id: number) {
    const cacheUser = await this.cacheService.get(`user.findOneUser.${id}`);
    if (cacheUser) return cacheUser;
    const user: { [prop: string]: any } = await this.database.userRepo.findOne({
      relations: ['roles', 'roles.permissions'],
      where: { id },
    });
    if (!user) {
      throw new DeepHttpException(ErrorMsg.USER_ID_INVALID, ErrorCode.USER_ID_INVALID);
    }
    this.database.userFollowRepo.createQueryBuilder('userFollow').select().where({ followingId: id }).orWhere({ followId: id });
    // 粉丝数量
    const followingCount = await this.database.userFollowRepo.count({ where: { followingId: id } });
    user.userFollowings = followingCount;
    // 关注人数
    const followCount = await this.database.userFollowRepo.count({ where: { followId: id } });
    user.userFollows = followCount;
    // 动态总浏览量
    const momentTotalViews = await this.database.momentRepo
      .createQueryBuilder('user')
      .select('SUM(user.viewCount) as totalViews')
      .where('user.userId = :userId', { userId: id })
      .getRawOne();
    user.momentTotalViews = momentTotalViews.totalViews;
    // 动态总点赞量
    const momentTotalLikes = await this.database.momentRepo
      .createQueryBuilder('m')
      .innerJoin(MomentLikesEntity, 'ml', 'm.id = ml.momentId') // 联表条件
      .select('COUNT(ml.userId)', 'totalLikes') // 计算总的点赞数
      .where('m.userId = :userId', { userId: id })
      .getRawOne();
    user.momentTotalLikes = momentTotalLikes.totalLikes;

    // 查询文章浏览量
    const articleTotalViews = await this.database.articleRepo
      .createQueryBuilder('user')
      .select('SUM(user.viewCount) as totalViews')
      .where('user.userId = :userId', { userId: id })
      .getRawOne();
    user.articleTotalViews = articleTotalViews.totalViews;

    // 文章总点赞量
    const articleTotalLikes = await this.database.articleRepo
      .createQueryBuilder('m')
      .innerJoin(ArticleLikesEntity, 'ml', 'm.id = ml.articleId') // 联表条件
      .select('COUNT(ml.userId)', 'totalLikes') // 计算总的点赞数
      .where('m.userId = :userId', { userId: id })
      .getRawOne();
    user.articleTotalLikes = articleTotalLikes.totalLikes;

    // 查询用户头像地址
    user.avatar = user.avatar && (await this.deepMinioService.getFileUrl(user.avatar, bucketName));
    this.cacheService.set(`user.findOneUser.${id}`, user, 60);
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    const { username, password, nickname, gender, email, status, bio, level, birthday, phone, school, major, position, github } =
      updateUserDto;
    if (await this.emailExist(email, id)) throw new DeepHttpException(ErrorMsg.EMAIL_EXIST, ErrorCode.EMAIL_EXIST);
    if (await this.userExist(email, id)) throw new DeepHttpException(ErrorMsg.USER_EXIST, ErrorCode.USER_EXIST);
    const user = new UserEntity();
    user.username = username;
    user.password = password;
    user.nickname = nickname;
    user.gender = gender;
    user.email = email;
    user.status = status;
    user.bio = bio;
    user.level = level;
    user.birthday = birthday;
    user.phone = phone;
    user.school = school;
    user.major = major;
    user.position = position;
    user.github = github;
    try {
      // 文件名处理
      if (file) {
        user.avatar = file.originalname = new Date().getTime() + extname(file.originalname);
        const userEntity = await this.database.userRepo.findOne({ where: { id }, select: ['avatar'] });
        // 对象存储
        await this.deepMinioService.uploadFile(file, bucketName);
        // 对象删除
        await this.deepMinioService.deleteFile(userEntity?.avatar, bucketName);
      }
      return await this.database.userRepo.update(id, user);
    } catch (error) {
      throw new DeepHttpException(ErrorMsg.DATABASE_HANDLE_ERROR, ErrorCode.DATABASE_HANDLE_ERROR);
    }
  }

  async removeUser(id: number) {
    const userEntity = await this.database.userRepo.findOne({ where: { id }, select: ['avatar', 'username'] });
    if (userEntity.username === 'superAdmin') {
      throw new DeepHttpException(ErrorMsg.SUPER_ADMIN_READ_ONLY, ErrorCode.SUPER_ADMIN_READ_ONLY);
    }
    // 清除缓存
    await this.cacheService.del(`user.findOneUser.${id}`);
    // 对象删除
    await this.deepMinioService.deleteFile(userEntity?.avatar, bucketName);
    // 用户删除
    return await this.database.userRepo.delete(id);
  }

  async changeStatus(id: string) {
    const user = await this.database.userRepo.findOne({
      where: { id: +id },
    });
    if (user) {
      user.status = user.status === 0 ? 1 : 0;
      return this.database.userRepo.save(user);
    } else {
      throw new DeepHttpException(ErrorMsg.USER_NOT_EXIST, ErrorCode.USER_NOT_EXIST);
    }
  }

  async getFollowers(userId: number, query: PaginationQueryDto) {
    const pagenum = +query.pagenum;
    const pagesize = +query.pagesize;
    const sql = `
    SELECT u.nickname,u.username,u.bio,u.level,u.school,u.avatar,u.gender 
    FROM user_follow uf
    INNER JOIN user u ON uf.followId = u.id 
    WHERE uf.followId=${userId}
    LIMIT ${pagesize} OFFSET ${pagesize * (pagenum - 1)};`;
    const result = await this.database.entityManager.query(sql);
    // minio中取出文件
    await Promise.all(
      result.map(async (item) => {
        item.avatar && (item.avatar = await this.deepMinioService.getFileUrl(item.avatar));
      }),
    );
    return result;
  }

  async getFollowing(userId: number, query: PaginationQueryDto) {
    const pagenum = +query.pagenum;
    const pagesize = +query.pagesize;
    const sql = `
    SELECT u.nickname,u.username,u.level,u.school,u.avatar,u.gender 
    FROM user_follow uf
    INNER JOIN user u ON uf.followingId = u.id 
    WHERE uf.followId=${userId}
    LIMIT ${pagesize} OFFSET ${pagesize * (pagenum - 1)};`;
    const result = await this.database.entityManager.query(sql);
    // minio中取出文件
    await Promise.all(
      result.map(async (item) => {
        item.avatar && (item.avatar = await this.deepMinioService.getFileUrl(item.avatar));
      }),
    );
    return result;
  }

  async getLikesList(userId: number, query: PaginationQueryDto) {
    const pagenum = +query.pagenum;
    const pagesize = +query.pagesize;
    const sql = `
    SELECT  m.* ,JSON_OBJECT(
      'id', u.id,
      'username', u.username,
      'level', u.level,
      'avatar', u.avatar,
      'gender', u.gender
    ) AS user
    FROM moment m
    INNER JOIN moment_likes ml ON ml.momentId = m.id  
    INNER JOIN user u ON ml.userId = u.id
    WHERE ml.userId=${userId}
    LIMIT ${pagesize} OFFSET ${pagesize * (pagenum - 1)};`;
    const result = await this.database.entityManager.query(sql);
    // minio中取出文件
    await Promise.all(
      result.map(async (item) => {
        item?.images && (item.images = await this.deepMinioService.getFileUrls(item.images.split(',')));
        item.user?.avatar && (item.user.avatar = await this.deepMinioService.getFileUrls(item.user.avatar));
      }),
    );
    return result;
  }
}
