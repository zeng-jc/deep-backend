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
    public readonly articleLabelRelationRepo: Repository<ArticleLabelRelationEntity>,
    @InjectRepository(MomentEntity)
    public readonly momentEntityRepo: Repository<MomentEntity>,
    @InjectRepository(MomentCommentEntity)
    public readonly momentCommentEntityRepo: Repository<MomentCommentEntity>,
    @InjectRepository(MomentLabelEntity)
    public readonly momentLabelEntityRepo: Repository<MomentLabelEntity>,
    @InjectRepository(MomentLabelRelationEntity)
    public readonly momentLabelRelationEntityRepo: Repository<MomentLabelRelationEntity>,

    @InjectEntityManager()
    public readonly entityManager: EntityManager,
  ) {}
}
