import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '@app/deep-orm/entities';
import { Like } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { CacheService } from '@app/deep-cache';
import { DeepHttpException, CmsErrorMsg, CmsErrorCode } from '@app/common/exceptionFilter';
import { AssignRoleUserDto } from './dto/assignRole-user.dto';
import { EmailService } from '@app/common/emailService/email.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(
    private readonly database: DatabaseService,
    private readonly cacheService: CacheService,
    private readonly emailService: EmailService,
  ) {}

  async assginRole(assignRoleUserDto: AssignRoleUserDto) {
    const role = await this.database.roleRepo.findOne({
      where: { id: assignRoleUserDto.roleId },
    });
    if (!role) throw new DeepHttpException(CmsErrorMsg.ROLE_NOT_EXIST, CmsErrorCode.ROLE_NOT_EXIST);
    assignRoleUserDto;
    await this.findOneUser(assignRoleUserDto.userId);
    return this.database.userRepo.save({
      roles: [role],
      id: assignRoleUserDto.userId,
    });
  }

  async emailExist(email: string): Promise<number> {
    return await this.database.userRepo.count({ where: { email } });
  }

  async userExist(username: string): Promise<number> {
    return await this.database.userRepo.count({ where: { username } });
  }
  // TODO: 密码加密
  async createUser(createUserDto: CreateUserDto) {
    const { username, password, nickname, gender, email, status, bio, level, birthday, phone, school, major, position, github } =
      createUserDto;
    if ((await this.userExist(username)) !== 0) return 'user exist';
    if ((await this.emailExist(email)) !== 0) return 'email exist';
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
    const curpage = Number.parseInt(query.curpage);
    const pagesize = Number.parseInt(query.pagesize);
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
    this.cacheService.set(`user.findOneUser.${id}`, user, 1000 * 60);
    return user;
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = new UserEntity();
    user.username = updateUserDto.username;
    user.password = updateUserDto.password;
    user.nickname = updateUserDto.nickname;
    user.gender = updateUserDto.gender;
    user.email = updateUserDto.email;
    user.status = updateUserDto.status;
    user.bio = updateUserDto.bio;
    user.level = updateUserDto.level;
    user.birthday = updateUserDto.birthday;
    user.phone = updateUserDto.phone;
    user.school = updateUserDto.school;
    user.major = updateUserDto.major;
    user.position = updateUserDto.position;
    user.github = updateUserDto.github;
    return this.database.userRepo.update(id, user);
  }

  async removeUser(id: number) {
    const data = await this.database.userRepo.delete(id);
    if (data.affected !== 0) await this.cacheService.del(`user.findOneUser.${id}`);
    return data;
  }

  async lockUser(id: string) {
    const user = await this.database.userRepo.findOne({
      where: { id: +id },
    });
    if (user) {
      user.status = user.status === 0 ? 1 : 0;
      return this.database.userRepo.save(user);
    } else {
      throw new DeepHttpException(CmsErrorMsg.USER_NOT_EXEITST, CmsErrorCode.USER_NOT_EXEITST);
    }
  }
}
