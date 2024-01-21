import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from '@app/deep-orm';
import { In } from 'typeorm';
import {
  DeepHttpException,
  CmsErrorMsg,
  CmsErrorCode,
} from '@app/common/exceptionFilter';
import { AssignPermissionRoleDto } from './dto/assignPermission-role.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RoleService {
  constructor(private readonly database: DatabaseService) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const res = await this.database.roleRepo.findOne({
      where: { name: createRoleDto.name },
    });
    if (res)
      throw new DeepHttpException(
        CmsErrorMsg.ROLE_EXIST,
        CmsErrorCode.ROLE_EXIST,
      );
    const role = new RoleEntity();
    role.name = createRoleDto.name;
    role.desc = createRoleDto.desc;
    return this.database.roleRepo.save(role);
  }

  async assignPermissions(assignPermissionRoleDto: AssignPermissionRoleDto) {
    const permissions = await this.database.permissionRepo.find({
      where: {
        id: In(assignPermissionRoleDto.permissionIds),
      },
    });
    if (permissions.length === 0)
      throw new DeepHttpException(
        CmsErrorMsg.PERMISSION_NOT_EXIST,
        CmsErrorCode.PERMISSION_NOT_EXIST,
      );
    // DOTO：还需要判断权限是否已经分配
    return this.database.roleRepo.save({
      permissions,
      id: assignPermissionRoleDto.roleId,
    });
  }

  findAllRole() {
    return this.database.roleRepo.find();
  }

  findOneRole(id: number) {
    return this.database.roleRepo.findOne({
      where: {
        id,
      },
    });
  }

  updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const role = new RoleEntity();
    role.name = updateRoleDto.name;
    role.desc = updateRoleDto.desc;
    return this.database.roleRepo.update(id, role);
  }

  removeRole(id: number) {
    return this.database.roleRepo.delete(id);
  }
}
