import { Injectable, SetMetadata } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CacheService } from '@app/deep-cache';
import { DatabaseService } from '../database/database.service';
import { DeepMinioService } from '@app/deep-minio';
import { UserEntity } from '@app/deep-orm';
import { DeepHttpException, ErrorCode, ErrorMsg } from '@app/common/exceptionFilter';
import { extname } from 'path';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { bucketNameEnum } from '@app/deep-minio/deep-minio.bucket-name';

const bucketName = bucketNameEnum.deepAvatar;

@SetMetadata('tableName', 'user')
@Injectable()
export class UserService {
  constructor(
    private readonly database: DatabaseService,
    private readonly cacheService: CacheService,
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

  async findOneUser(id: number) {
    const cacheUser = await this.cacheService.get(`user.findOneUser.${id}`);
    if (cacheUser) return cacheUser;
    const user: { [prop: string]: any } = await this.database.userRepo.findOne({
      where: { id },
    });
    if (!user) {
      throw new DeepHttpException(ErrorMsg.USER_ID_INVALID, ErrorCode.USER_ID_INVALID);
    }
    // 粉丝数量
    const followingCount = await this.database.userFollowRepo.count({ where: { followingId: id } });
    // 关注人数
    const followCount = await this.database.userFollowRepo.count({ where: { followId: id } });
    user.userFollowings = followingCount;
    user.userFollows = followCount;
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
        await this.deepMinioService.deleteFile(userEntity.avatar, bucketName);
      }
      return await this.database.userRepo.update(id, user);
    } catch (error) {
      throw new DeepHttpException(ErrorMsg.DATABASE_HANDLE_ERROR, ErrorCode.DATABASE_HANDLE_ERROR);
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
      throw new DeepHttpException(ErrorMsg.DATABASE_HANDLE_ERROR, ErrorCode.DATABASE_HANDLE_ERROR);
    }
  }

  async getFollowerCount(userId: number) {
    return this.database.userFollowRepo.count({ where: { followingId: userId } });
  }

  async getFollowingCount(userId: number) {
    return this.database.userFollowRepo.count({ where: { followId: userId } });
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

  async getUserMomentTotalViews(userId: number) {
    return await this.database.momentRepo
      .createQueryBuilder('user')
      .select('SUM(user.viewCount) as totalViews')
      .where('user.userId = :userId', { userId })
      .getRawOne();
  }

  async getUserMomentTotalLikes(userId: number) {
    const sql = `SELECT * from moment m inner join moment_likes ml on m.id = ml.momentId where m.userId=${userId};`;
    const result = await this.database.entityManager.query(sql);
    return result;
  }
}
