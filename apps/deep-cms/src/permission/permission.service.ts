import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '@app/deep-orm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
  ) {}
  createPermission(createPermissionDto: CreatePermissionDto) {
    const permission = new PermissionEntity();
    permission.name = createPermissionDto.name;
    permission.desc = createPermissionDto.desc;
    return this.permissionRepo.save(permission);
  }

  findAllPermission() {
    return this.permissionRepo.find();
  }

  findOnePermission(id: number) {
    return this.permissionRepo.findOne({
      where: {
        id,
      },
    });
  }

  updatePermission(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = new PermissionEntity();
    permission.name = updatePermissionDto.name;
    permission.desc = updatePermissionDto.desc;
    return this.permissionRepo.update(id, permission);
  }

  removePermission(id: number) {
    return this.permissionRepo.delete(id);
  }
}
