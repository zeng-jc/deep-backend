import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from '@app/deep-orm';
import { In } from 'typeorm';
import { DeepHttpException, ErrorMsg, ErrorCode } from '@app/common/exceptionFilter';
import { DatabaseService } from '../database/database.service';
import { AssignRoleDto } from './dto/assign-role.dto';

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

  findAllRole() {
    return this.database.roleRepo.find({ relations: ['permissions'] });
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
