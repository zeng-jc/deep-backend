import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '@app/deep-orm/entities';
import { Like } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { CacheService } from '@app/deep-cache';
import { DeepHttpException, CmsErrorMsg, CmsErrorCode } from '@app/common/exceptionFilter';
import { EmailService } from '@app/common/emailService/email.service';
import { DatabaseService } from '../database/database.service';
import { extname } from 'path';
import { DeepMinioService } from '@app/deep-minio';
const bucketName = 'deep-avatar';
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
    if (await this.userExist(username)) throw new DeepHttpException(CmsErrorMsg.USER_EXIST, CmsErrorCode.USER_EXIST);
    if (await this.emailExist(email)) throw new DeepHttpException(CmsErrorMsg.EMAIL_EXIST, CmsErrorCode.EMAIL_EXIST);
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
    this.emailService.sendMailCreateUser(email, nickname);
    return this.database.userRepo.save(user);
  }

  async findMultiUser(query: PaginationQueryDto) {
    let { keywords } = query;
    keywords = keywords ?? '';
    const curpage = +query.curpage;
    const pagesize = +query.pagesize;
    const [data, total] = await this.database.userRepo.findAndCount({
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
      skip: pagesize * (curpage - 1),
      take: pagesize,
    });
    await Promise.all(
      data.map(
        async (userEntity) =>
          (userEntity.avatar = userEntity.avatar && (await this.deepMinioService.getFileUrl(userEntity.avatar, bucketName))),
      ),
    );
    return {
      data,
      total,
    };
  }

  async findOneUser(id: number) {
    const cacheUser = await this.cacheService.get(`user.findOneUser.${id}`);
    if (cacheUser) return cacheUser;
    const user = await this.database.userRepo.findOne({
      relations: ['roles', 'roles.permissions'],
      where: { id },
    });
    if (!user) {
      throw new DeepHttpException(CmsErrorMsg.USER_ID_INVALID, CmsErrorCode.USER_ID_INVALID);
    }
    user.avatar = user.avatar && (await this.deepMinioService.getFileUrl(user.avatar, bucketName));
    this.cacheService.set(`user.findOneUser.${id}`, user, 60);
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    const { username, password, nickname, gender, email, status, bio, level, birthday, phone, school, major, position, github } =
      updateUserDto;
    if (await this.emailExist(email, id)) throw new DeepHttpException(CmsErrorMsg.EMAIL_EXIST, CmsErrorCode.EMAIL_EXIST);
    if (await this.userExist(email, id)) throw new DeepHttpException(CmsErrorMsg.USER_EXIST, CmsErrorCode.USER_EXIST);
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
        await this.deepMinioService.deleteFile(userEntity.avatar, bucketName);
      }
      return await this.database.userRepo.update(id, user);
    } catch (error) {
      throw new DeepHttpException(CmsErrorMsg.DATABASE_HANDLE_ERROR, CmsErrorCode.DATABASE_HANDLE_ERROR);
    }
  }

  async removeUser(id: number) {
    try {
      const userEntity = await this.database.userRepo.findOne({ where: { id }, select: ['avatar'] });
      // 清除缓存
      await this.cacheService.del(`user.findOneUser.${id}`);
      // 对象删除
      await this.deepMinioService.deleteFile(userEntity.avatar, bucketName);
      // 用户删除
      return await this.database.userRepo.delete(id);
    } catch (error) {
      throw new DeepHttpException(CmsErrorMsg.DATABASE_HANDLE_ERROR, CmsErrorCode.DATABASE_HANDLE_ERROR);
    }
  }

  async lockUser(id: string) {
    const user = await this.database.userRepo.findOne({
      where: { id: +id },
    });
    if (user) {
      user.status = user.status === 0 ? 1 : 0;
      return this.database.userRepo.save(user);
    } else {
      throw new DeepHttpException(CmsErrorMsg.USER_NOT_EXIST, CmsErrorCode.USER_NOT_EXIST);
    }
  }

  async followUser(followId: number, followingId: number) {
    try {
      const data = await this.database.userFollowRepo.findOne({ where: { followId, followingId } });
      if (data) {
        await this.database.userFollowRepo.delete({ followId, followingId });
        return false;
      } else {
        await this.database.userFollowRepo.save({ followId, followingId });
        return true;
      }
    } catch (error) {
      throw new DeepHttpException(CmsErrorMsg.DATABASE_HANDLE_ERROR, CmsErrorCode.DATABASE_HANDLE_ERROR);
    }
  }

  async getFollowerCount(userId: number) {
    return this.database.userFollowRepo.count({ where: { followingId: userId } });
  }

  async getFollowingCount(userId: number) {
    return this.database.userFollowRepo.count({ where: { followId: userId } });
  }

  async getFollowers(userId: number, query: PaginationQueryDto) {
    const curpage = +query.curpage;
    const pagesize = +query.pagesize;
    const sql = `
    SELECT u.nickname,u.username,u.bio,u.level,u.school,u.avatar,u.gender 
    FROM user_follow uf
    INNER JOIN user u ON uf.followId = u.id 
    WHERE uf.followId=${userId}
    LIMIT ${pagesize} OFFSET ${pagesize * (curpage - 1)};`;
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
    const curpage = +query.curpage;
    const pagesize = +query.pagesize;
    const sql = `
    SELECT u.nickname,u.username,u.level,u.school,u.avatar,u.gender 
    FROM user_follow uf
    INNER JOIN user u ON uf.followingId = u.id 
    WHERE uf.followId=${userId}
    LIMIT ${pagesize} OFFSET ${pagesize * (curpage - 1)};`;
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
    const curpage = +query.curpage;
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
    LIMIT ${pagesize} OFFSET ${pagesize * (curpage - 1)};`;
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
