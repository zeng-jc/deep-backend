import { Injectable } from '@nestjs/common';
import { SigninAuthDto } from './dto/signin-auth.dto';
// import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '@app/common';
import { ErrorCode, ErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';
import { DatabaseService } from '../database/database.service';
import { SecretKeyService } from '@app/common/secretKey/secretKey.service';
import { SendEmailDto } from './dto/send-email.dot';
import { generateEmailVerificationCode } from '../common/utils/generateEmailVerificationCode';
import { CacheService } from '@app/deep-cache';
import { EmailService } from '@app/common/emailService/email.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from '@app/deep-orm';
import { v4 as uuidv4 } from 'uuid';
import { EmailVerificationCodeDto } from './dto/email-verfication-code.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly secretKey: SecretKeyService,
    private readonly cacheService: CacheService,
    private readonly emailService: EmailService,
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
  async getEmailVerifyCode(sendEmailDto: SendEmailDto) {
    const VerificationCode = generateEmailVerificationCode();
    const { email, nickname } = sendEmailDto;
    const res = await this.emailService.sendMailVerifyCode(email, nickname, VerificationCode);
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
    // 清空验证码
    this.cacheService.del(`${email}.${uuid}`);
    return this.database.userRepo.save(user);
  }

  // 账号密码登录
  async signinAccount(signinAuthData: SigninAuthDto) {
    const { username, password } = signinAuthData;
    const userInfo = await this.database.userRepo.findOne({
      where: {
        username,
        password,
      },
    });
    if (!userInfo) {
      throw new DeepHttpException(ErrorMsg.INVALID_IDENTITY_INFORMATION, ErrorCode.INVALID_IDENTITY_INFORMATION);
    }
    const TOKEN = this.createToken<TokenPayload>({
      id: userInfo.id,
      username: userInfo.username,
    });
    const data = {
      userInfo,
      token: TOKEN,
    };
    return data;
  }

  // 验证码登录
  async signinVerificationCode(emailVerificationCodeDto: EmailVerificationCodeDto) {
    const { email } = emailVerificationCodeDto;
    if (!(await this.checkEmailVerificationCode(emailVerificationCodeDto)))
      throw new DeepHttpException(ErrorMsg.VERIFICATION_CODE_ERROR, ErrorCode.VERIFICATION_CODE_ERROR);
    const userInfo = await this.database.userRepo.findOne({
      where: {
        email,
      },
    });
    if (!userInfo) {
      throw new DeepHttpException(ErrorMsg.INVALID_IDENTITY_INFORMATION, ErrorCode.INVALID_IDENTITY_INFORMATION);
    }
    const TOKEN = this.createToken<TokenPayload>({
      id: userInfo.id,
      username: userInfo.username,
    });
    const data = {
      userInfo,
      token: TOKEN,
    };
    return data;
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
      result = jwt.verifyToken(token, this.secretKey.getPublicKey(), {
        algorithms: ['RS256'],
      });
    } catch (error) {
      throw new DeepHttpException(ErrorMsg.TOKEN_INVALID, ErrorCode.TOKEN_INVALID);
    }
    return result;
  }
}
