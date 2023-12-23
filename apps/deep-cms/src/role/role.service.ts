import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '@app/deep-orm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
  ) {}

  createRole(createRoleDto: CreateRoleDto) {
    const role = new RoleEntity();
    role.name = createRoleDto.name;
    role.desc = createRoleDto.desc;
    return this.roleRepo.save(role);
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
