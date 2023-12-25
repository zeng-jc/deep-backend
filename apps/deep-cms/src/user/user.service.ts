import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity, UserEntity } from '@app/deep-orm/entities';
import { Like, Repository } from 'typeorm';
import { QueryUserDto } from './dto/query-user.dto';
import { CacheService } from '@app/deep-cache';
import { DeepHttpException } from '@app/common';
import { cmsStatusCode } from '@app/common/ResStatusCode/cms.statusCode';
import { AssignRoleUserDto } from './dto/assignRole-user.dto';
import { EmailService } from '../common/service/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    private readonly cacheService: CacheService,
    private readonly emailService: EmailService,
  ) {}

  async assginRole(assignRoleUserDto: AssignRoleUserDto) {
    const role = await this.roleRepo.findOne({
      where: { id: assignRoleUserDto.roleId },
    });
    if (!role)
      throw new DeepHttpException('角色不存在', cmsStatusCode.ROLE_NOT_EXIST);
    assignRoleUserDto;
    await this.findOneUser(assignRoleUserDto.userId);
    return this.userRepo.save({
      roles: [role],
      id: assignRoleUserDto.userId,
    });
  }

  async emailExist(email: string): Promise<number> {
    return await this.userRepo.count({ where: { email } });
  }

  async userExist(username: string): Promise<number> {
    return await this.userRepo.count({ where: { username } });
  }

  async createUser(createUserDto: CreateUserDto) {
    if ((await this.userExist(createUserDto.username)) !== 0)
      return 'user exist';
    if ((await this.emailExist(createUserDto.email)) !== 0)
      return 'email exist';
    const user = new UserEntity();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.nickname = createUserDto.nickname;
    user.gender = createUserDto.gender;
    user.email = createUserDto.email;
    user.status = createUserDto.status;
    user.bio = createUserDto.bio;
    user.level = createUserDto.level;
    user.birthday = createUserDto.birthday;
    user.phone = createUserDto.phone;
    user.school = createUserDto.school;
    user.major = createUserDto.major;
    user.position = createUserDto.position;
    user.github = createUserDto.github;
    // 发送邮箱
    this.emailService.sendMailCreateUser(
      createUserDto.email,
      createUserDto.nickname,
    );
    return this.userRepo.save(user);
  }

  async findMultiUser(query: QueryUserDto) {
    let { keywords } = query;
    keywords = keywords ?? '';
    const curpage = Number.parseInt(query.curpage);
    const pagesize = Number.parseInt(query.pagesize);
    const [data, total] = await this.userRepo.findAndCount({
      relations: ['avatar', 'roles'],
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
    const user = await this.userRepo.findOne({
      relations: ['avatar', 'roles', 'roles.permissions'],
      where: { id },
    });
    if (!user) {
      throw new DeepHttpException('用户不存在', cmsStatusCode.USER_ID_INVALID);
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
    return this.userRepo.update(id, user);
  }

  async removeUser(id: number) {
    const data = await this.userRepo.delete(id);
    if (data.affected !== 0)
      await this.cacheService.del(`user.findOneUser.${id}`);
    return data;
  }

  async lockUser(id: string) {
    const user = await this.userRepo.findOne({ where: { id: +id } });
    if (user) {
      user.status = user.status === 0 ? 1 : 0;
      return this.userRepo.save(user);
    } else {
      return 'operator failed';
    }
  }
}
