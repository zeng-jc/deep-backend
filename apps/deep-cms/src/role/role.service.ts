import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from '@app/deep-orm';
import { In, Like } from 'typeorm';
import { DeepHttpException, ErrorMsg, ErrorCode } from '@app/common/exceptionFilter';
import { DatabaseService } from '../database/database.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';

@Injectable()
export class RoleService {
  constructor(private readonly database: DatabaseService) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const res = await this.database.roleRepo.findOne({
      where: { name: createRoleDto.name },
    });
    if (res) throw new DeepHttpException(ErrorMsg.ROLE_EXIST, ErrorCode.ROLE_EXIST);
    const role = new RoleEntity();
    role.name = createRoleDto.name;
    role.desc = createRoleDto.desc;
    return this.database.roleRepo.save(role);
  }

  // 给用户分配角色（替换角色）
  async assignRole(assignRoleDto: AssignRoleDto) {
    const { roleIds, userId } = assignRoleDto;
    const roles = await this.database.roleRepo.find({
      where: { id: In(roleIds) },
    });
    if (!roles) throw new DeepHttpException(ErrorMsg.ROLE_NOT_EXIST, ErrorCode.ROLE_NOT_EXIST);
    return this.database.userRepo.save({
      roles,
      id: userId,
    });
  }

  async findRoleList(query: PaginationQueryDto) {
    const { keywords, pagenum, pagesize } = query;
    const [list, total] = await this.database.roleRepo.findAndCount({
      relations: ['permissions'],
      where: [
        {
          name: Like(`%${keywords ?? ''}%`),
        },
      ],
      order: { id: 'DESC' },
      skip: pagesize * (pagenum - 1),
      take: pagesize,
    });
    return {
      list,
      total,
    };
  }

  findOneRole(id: number) {
    return this.database.roleRepo.findOne({
      where: {
        id,
      },
    });
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const name = (await this.database.roleRepo.findOne({ where: { id } })).name;
    if (name === 'superAdmin') {
      throw new DeepHttpException(ErrorMsg.SUPER_ADMIN_READ_ONLY, ErrorCode.SUPER_ADMIN_READ_ONLY);
    }
    const role = new RoleEntity();
    role.name = updateRoleDto.name;
    role.desc = updateRoleDto.desc;
    return this.database.roleRepo.update(id, role);
  }

  async removeRole(id: number) {
    const name = (await this.database.roleRepo.findOne({ where: { id } })).name;
    if (name === 'superAdmin') {
      throw new DeepHttpException(ErrorMsg.SUPER_ADMIN_READ_ONLY, ErrorCode.SUPER_ADMIN_READ_ONLY);
    }
    return this.database.roleRepo.delete(id);
  }

  async changeRoleStatus(id) {
    const name = (await this.database.roleRepo.findOne({ where: { id } })).name;
    if (name === 'superAdmin') {
      throw new DeepHttpException(ErrorMsg.SUPER_ADMIN_READ_ONLY, ErrorCode.SUPER_ADMIN_READ_ONLY);
    }
    const article = await this.database.roleRepo.findOne({
      where: { id: +id },
    });
    article.status = article.status === 0 ? 1 : 0;
    return this.database.roleRepo.save(article);
  }
}
