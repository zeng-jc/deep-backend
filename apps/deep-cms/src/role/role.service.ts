import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity, RoleEntity } from '@app/deep-orm';
import { In, Repository } from 'typeorm';
import {
  DeepHttpException,
  CmsErrorMsg,
  CmsErrorCode,
} from '@app/common/exceptionFilter';
import { AssignPermissionRoleDto } from './dto/assignPermission-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const res = await this.roleRepo.findOne({
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
    return this.roleRepo.save(role);
  }

  async assignPermissions(assignPermissionRoleDto: AssignPermissionRoleDto) {
    const permissions = await this.permissionRepo.find({
      where: {
        id: In(assignPermissionRoleDto.permissionIds),
      },
    });
    if (permissions.length === 0)
      throw new DeepHttpException(
        CmsErrorMsg.PERMISSION_NOT_EXIST,
        CmsErrorCode.PERMISSION_NOT_EXIST,
      );
    // DOTO：判断权限是否已经分配
    return this.roleRepo.save({
      permissions,
      id: assignPermissionRoleDto.roleId,
    });
  }

  findAllRole() {
    return this.roleRepo.find();
  }

  findOneRole(id: number) {
    return this.roleRepo.findOne({
      where: {
        id,
      },
    });
  }

  updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const role = new RoleEntity();
    role.name = updateRoleDto.name;
    role.desc = updateRoleDto.desc;
    return this.roleRepo.update(id, role);
  }

  removeRole(id: number) {
    return this.roleRepo.delete(id);
  }
}
