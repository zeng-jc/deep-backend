import {
  UserEntity,
  AvatarEntity,
  RoleEntity,
  PermissionEntity,
  ArticleEntity,
} from '@app/deep-orm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepo: Repository<UserEntity>,
    @InjectRepository(AvatarEntity)
    public readonly avatarRepo: Repository<AvatarEntity>,
    @InjectRepository(RoleEntity)
    public readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    public readonly permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(ArticleEntity)
    public readonly articleRepo: Repository<ArticleEntity>,

    @InjectEntityManager()
    public readonly entityManager: EntityManager,
  ) {}
}
