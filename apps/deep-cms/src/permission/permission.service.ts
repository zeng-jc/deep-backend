import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '@app/deep-orm';
import { Repository } from 'typeorm';
import { DeepHttpException, cmsStatusCode } from '@app/common';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
  ) {}
  async createPermission(createPermissionDto: CreatePermissionDto) {
    const res = await this.permissionRepo.findOne({
      where: {
        name: createPermissionDto.name,
      },
    });
    if (res)
      throw new DeepHttpException(
        '权限已经存在',
        cmsStatusCode.PERMISSION_EXIST,
      );
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
