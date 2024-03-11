import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { PermissionEntity } from '@app/deep-orm';
import { DeepHttpException, ErrorMsg, ErrorCode } from '@app/common/exceptionFilter';
import { DatabaseService } from '../database/database.service';
import { In } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly database: DatabaseService) {}

  async findPermissions(id: number) {
    const userInfo = await this.database.userRepo.findOne({
      relations: ['roles', 'roles.permissions'],
      where: {
        id,
      },
    });

    if (userInfo) {
      const permissions = userInfo.roles.flatMap((role) => role.permissions);
      const permissionNames = permissions.map((permission) => permission.name);
      return [...new Set(permissionNames)];
    } else {
      return [];
    }
  }

  async assignPermissions(assignPermissionDto: AssignPermissionDto) {
    const { roleId, permissionIds } = assignPermissionDto;
    const name = (await this.database.roleRepo.findOne({ where: { id: roleId } })).name;
    if (name === 'superAdmin') {
      throw new DeepHttpException(ErrorMsg.SUPER_ADMIN_READ_ONLY, ErrorCode.SUPER_ADMIN_READ_ONLY);
    }
    const permissions = await this.database.permissionRepo.find({
      where: {
        id: In(permissionIds),
      },
    });
    if (permissions.length === 0) throw new DeepHttpException(ErrorMsg.PERMISSION_NOT_EXIST, ErrorCode.PERMISSION_NOT_EXIST);
    // TODO：还需要判断权限是否已经分配
    return this.database.roleRepo.save({
      permissions,
      id: roleId,
    });
  }

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const res = await this.database.permissionRepo.findOne({
      where: {
        name: createPermissionDto.name,
      },
    });
    if (res) throw new DeepHttpException(ErrorMsg.PERMISSION_EXIST, ErrorCode.PERMISSION_EXIST);
    const permission = new PermissionEntity();
    permission.name = createPermissionDto.name;
    permission.desc = createPermissionDto.desc;
    permission.menuId = createPermissionDto.menuId;
    return this.database.permissionRepo.save(permission);
  }

  findAllPermission(query: PaginationQueryDto) {
    const { keywords } = query;
    return this.database.permissionRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.menu', 'menu')
      .select(['p.id', 'p.name', 'p.desc', 'menu.id', 'menu.name'])
      .where('p.name LIKE :keywords', { keywords: `%${keywords}%` })
      .getMany();
  }

  findOnePermission(id: number) {
    return this.database.permissionRepo.findOne({
      where: {
        id,
      },
    });
  }

  updatePermission(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = new PermissionEntity();
    permission.name = updatePermissionDto.name;
    permission.desc = updatePermissionDto.desc;
    return this.database.permissionRepo.update(id, permission);
  }

  removePermission(id: number) {
    return this.database.permissionRepo.delete(id);
  }
}
