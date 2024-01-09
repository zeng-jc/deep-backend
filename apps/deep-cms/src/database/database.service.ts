import {
  UserEntity,
  AvatarEntity,
  RoleEntity,
  PermissionEntity,
  ArticleEntity,
} from '@app/deep-orm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(UserEntity)
    readonly userRepo: Repository<UserEntity>,
    @InjectRepository(AvatarEntity)
    readonly avatarRepo: Repository<AvatarEntity>,
    @InjectRepository(RoleEntity)
    readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    readonly permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(ArticleEntity)
    readonly articleRepo: Repository<ArticleEntity>,
  ) {}
}
