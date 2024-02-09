import {
  UserEntity,
  AvatarEntity,
  RoleEntity,
  PermissionEntity,
  ArticleEntity,
  ArticleCommentEntity,
  ArticleLabelEntity,
  ArticleLabelRelationEntity,
  MomentEntity,
  MomentCommentEntity,
  MomentLabelEntity,
  MomentLabelRelationEntity,
  MenuEntity,
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
    @InjectRepository(ArticleCommentEntity)
    public readonly articleCommentRepo: Repository<ArticleCommentEntity>,
    @InjectRepository(ArticleLabelEntity)
    public readonly articleLabelRepo: Repository<ArticleLabelEntity>,
    @InjectRepository(ArticleLabelRelationEntity)
    public readonly articleLabelRelsRepo: Repository<ArticleLabelRelationEntity>,
    @InjectRepository(MomentEntity)
    public readonly momentEntityRepo: Repository<MomentEntity>,
    @InjectRepository(MomentCommentEntity)
    public readonly momentCommentRepo: Repository<MomentCommentEntity>,
    @InjectRepository(MomentLabelEntity)
    public readonly momentLabelRepo: Repository<MomentLabelEntity>,
    @InjectRepository(MomentLabelRelationEntity)
    public readonly momentLabelRelsRepo: Repository<MomentLabelRelationEntity>,
    @InjectRepository(MenuEntity)
    public readonly menuRepo: Repository<MenuEntity>,

    @InjectEntityManager()
    public readonly entityManager: EntityManager,
  ) {}
}
