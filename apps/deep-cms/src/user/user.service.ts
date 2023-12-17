import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserEntity } from '@app/deep-orm/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly repoUserCustom: UserRepository,
    @InjectRepository(UserEntity)
    private readonly repoUser: Repository<UserEntity>,
  ) {}

  async emailExist(email: string): Promise<number> {
    return await this.repoUser.count({ where: { email } });
  }

  async userExist(username: string): Promise<number> {
    return await this.repoUser.count({ where: { username } });
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
    return this.repoUser.save(user);
  }

  async findMultiUser(query: QueryUserDto) {
    const { keyword } = query;
    const curpage = Number.parseInt(query.curpage);
    const pagesize = Number.parseInt(query.pagesize);
    const [data, total] = await this.repoUser.findAndCount({
      where: [
        {
          nickname: Like(`%${keyword}%`),
        },
        {
          username: Like(`%${keyword}%`),
        },
        {
          email: Like(`%${keyword}%`),
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

  findOneUser(id: number) {
    return this.repoUser.findOne({ where: { id } });
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
    return this.repoUser.update(id, user);
  }

  removeUser(id: number) {
    return this.repoUser.delete(id);
  }
}
