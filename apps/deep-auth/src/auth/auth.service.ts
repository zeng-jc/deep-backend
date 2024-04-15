import { Injectable } from '@nestjs/common';
import { SigninAuthDto } from './dto/signin-auth.dto';
import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '@app/common';
import { ErrorCode, ErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';
import { DatabaseService } from '../database/database.service';
import { SecretKeyService } from '@app/common/secretKey/secretKey.service';
import { generateEmailVerificationCode } from '../common/utils/generateEmailVerificationCode';
import { CacheService } from '@app/deep-cache';
import { EmailService } from '@app/common/emailService/email.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ArticleLikesEntity, MomentLikesEntity, UserEntity } from '@app/deep-orm';
import { v4 as uuidv4 } from 'uuid';
import { EmailVerificationCodeDto } from './dto/email-verfication-code.dto';
import { listToTree } from '../common/utils/listToTree';
import { DeepMinioService } from '@app/deep-minio';
import { bucketNameEnum } from '@app/deep-minio/deep-minio.bucket-name';

const bucketName = bucketNameEnum.deepAvatar;

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly secretKey: SecretKeyService,
    private readonly cacheService: CacheService,
    private readonly emailService: EmailService,
    private readonly deepMinioService: DeepMinioService,
  ) {}

  // 判断邮箱是否存储在
  async emailExist(email: string, excludeId?: number): Promise<boolean> {
    let queryBuilder = this.database.userRepo.createQueryBuilder('user');
    queryBuilder = queryBuilder.where('user.email = :email', { email });
    if (excludeId) {
      queryBuilder = queryBuilder.andWhere('user.id != :id', { id: excludeId });
    }
    return !!(await queryBuilder.getCount());
  }

  // 判断用户是否存储在
  async userExist(username: string, excludeId?: number): Promise<boolean> {
    let queryBuilder = this.database.userRepo.createQueryBuilder('user');
    queryBuilder = queryBuilder.where('user.username = :username', { username });
    if (excludeId) {
      queryBuilder = queryBuilder.andWhere('user.id != :id', { id: excludeId });
    }
    return !!(await queryBuilder.getCount());
  }

  // 获取邮箱验证码
  async getEmailVerifyCode(email: string) {
    const VerificationCode = generateEmailVerificationCode();
    const res = await this.emailService.sendMailVerifyCode(email, VerificationCode);
    if (!res) throw new DeepHttpException(ErrorMsg.VERIFICATION_CODE_SEND_FAILED, ErrorCode.VERIFICATION_CODE_SEND_FAILED);
    const uuid = uuidv4();
    this.cacheService.set(`${email}.${uuid}`, VerificationCode, 180);
    return { uuid };
  }

  // 验证码检查
  async checkEmailVerificationCode(emailVerificationCodeDto: EmailVerificationCodeDto) {
    const { email, uuid, verificationCode } = emailVerificationCodeDto;
    return (await this.cacheService.get(`${email}.${uuid}`)) === verificationCode;
  }

  // TODO: 密码加密
  async signup(createUserDto: CreateUserDto) {
    const { email, uuid, verificationCode, username, password, nickname } = createUserDto;
    // 后续可以考虑抽离到中间件中
    if (!(await this.checkEmailVerificationCode({ uuid, email, verificationCode })))
      throw new DeepHttpException(ErrorMsg.VERIFICATION_CODE_ERROR, ErrorCode.VERIFICATION_CODE_ERROR);
    if (await this.userExist(username)) throw new DeepHttpException(ErrorMsg.USER_EXIST, ErrorCode.USER_EXIST);
    if (await this.emailExist(email)) throw new DeepHttpException(ErrorMsg.EMAIL_EXIST, ErrorCode.EMAIL_EXIST);
    const user = new UserEntity();
    user.username = username;
    user.password = password;
    user.nickname = nickname;
    user.email = email;
    // 发送通知邮箱
    this.emailService.sendMailCreateUserNotify(email, nickname);
    // 清空缓存验证码
    this.cacheService.del(`${email}.${uuid}`);
    return this.database.userRepo.save(user);
  }

  // 账号密码登录
  async signinAccount(signinAuthData: SigninAuthDto) {
    const { username, password } = signinAuthData;
    const user: { [prop: string]: any } = await this.database.userRepo.findOne({
      where: {
        username,
        password,
      },
    });
    if (!user) {
      throw new DeepHttpException(ErrorMsg.INVALID_IDENTITY_INFORMATION, ErrorCode.INVALID_IDENTITY_INFORMATION);
    }
    const { id } = user;
    const TOKEN = this.createToken<TokenPayload>({
      id: user.id,
      username: user.username,
    });
    const data = {
      userInfo: user,
      token: TOKEN,
    };
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

    return data;
  }

  // 验证码登录
  async signinVerificationCode(emailVerificationCodeDto: EmailVerificationCodeDto) {
    const { email, uuid } = emailVerificationCodeDto;
    if (!(await this.checkEmailVerificationCode(emailVerificationCodeDto)))
      throw new DeepHttpException(ErrorMsg.VERIFICATION_CODE_ERROR, ErrorCode.VERIFICATION_CODE_ERROR);
    // 清空缓存验证码
    this.cacheService.del(`${email}.${uuid}`);
    const user: { [prop: string]: any } = await this.database.userRepo.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new DeepHttpException(ErrorMsg.INVALID_IDENTITY_INFORMATION, ErrorCode.INVALID_IDENTITY_INFORMATION);
    }
    const { id } = user;

    const TOKEN = this.createToken<TokenPayload>({
      id: user.id,
      username: user.username,
    });
    const data = {
      userInfo: user,
      token: TOKEN,
    };
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

    return data;
  }

  async getMenu(token: string) {
    const { id: userId } = this.verifyToken(token);
    const sql = `SELECT DISTINCT  
       menu.id AS id,  
       menu.name AS name,
       menu.path AS path,
       menu.component AS component,
       menu.parentId AS parentId,
       menu.title AS title,
       menu.link AS link,
       menu.icon AS icon
    FROM  
       menu  
    WHERE  
       EXISTS (  
           SELECT 1  
           FROM user_role_relation user_role 
           JOIN role role ON role.id = user_role.roleId  
           JOIN role_menu_relation role_menu ON role_menu.roleId = role.id  
           WHERE  
               user_role.userId = ? AND  
               menu.id = role_menu.menuId  
       );`;
    return listToTree(await this.database.entityManager.query(sql, [userId]), 'parentId', 'children');
  }

  async getPermission(token: string) {
    const { id: userId } = this.verifyToken(token);
    const sql = `SELECT DISTINCT        
        menu.name AS name,
        (    
            SELECT JSON_ARRAYAGG(permission.name)    
            FROM permission    
            WHERE permission.menuId = menu.id    
        ) AS permissions    
    FROM      
        menu      
    WHERE      
        EXISTS (      
            SELECT 1      
            FROM user_role_relation user_role     
            JOIN role_menu_relation role_menu ON role_menu.roleId = user_role.roleId      
            WHERE      
                user_role.userId = ? AND      
                menu.id = role_menu.menuId      
        );`;
    const resArr = await this.database.entityManager.query(sql, [userId]);
    const resObj = {};
    resArr.forEach((item) => {
      item.permissions && (resObj[item.name] = item.permissions);
    });
    return resObj;
  }

  createToken<T>(payload: T): string {
    return jwt.sign(payload, this.secretKey.getPrivateKey(), {
      algorithm: 'RS256',
      expiresIn: 60 * 60 * 24,
    });
  }

  refreshToken(token: string) {
    const { id, username } = this.verifyToken(token);
    return this.createToken<TokenPayload>({
      id,
      username,
    });
  }

  verifyToken(token: string): TokenPayload {
    let result;
    try {
      result = jwt.verify(token, this.secretKey.getPublicKey(), {
        algorithms: ['RS256'],
      });
    } catch (error) {
      throw new DeepHttpException(ErrorMsg.TOKEN_INVALID, ErrorCode.TOKEN_INVALID);
    }
    return result;
  }
}
