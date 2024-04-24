import {
  UserEntity,
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
  MomentLikesEntity,
  UserFollowEntity,
  ArticleLikesEntity,
  QuestionEntity,
  AnswerEntity,
  DailyVisitsEntity,
  AnnouncementEntity,
} from '@app/deep-orm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserFollowEntity)
    public readonly userFollowRepo: Repository<UserFollowEntity>,
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
    public readonly momentRepo: Repository<MomentEntity>,
    @InjectRepository(MomentCommentEntity)
    public readonly momentCommentRepo: Repository<MomentCommentEntity>,
    @InjectRepository(MomentLabelEntity)
    public readonly momentLabelRepo: Repository<MomentLabelEntity>,
    @InjectRepository(MomentLabelRelationEntity)
    public readonly momentLabelRelsRepo: Repository<MomentLabelRelationEntity>,
    @InjectRepository(MomentLikesEntity)
    public readonly momentLikesRepo: Repository<MomentLikesEntity>,
    @InjectRepository(ArticleLikesEntity)
    public readonly articleLikesRepo: Repository<ArticleLikesEntity>,
    @InjectRepository(QuestionEntity)
    public readonly questionRepo: Repository<QuestionEntity>,
    @InjectRepository(AnswerEntity)
    public readonly answerRepo: Repository<AnswerEntity>,
    @InjectRepository(MenuEntity)
    public readonly menuRepo: Repository<MenuEntity>,

    @InjectRepository(AnnouncementEntity)
    public readonly announcementRepo: Repository<AnnouncementEntity>,

    @InjectRepository(DailyVisitsEntity)
    public readonly dailyVisitsRepo: Repository<DailyVisitsEntity>,

    @InjectEntityManager()
    public readonly entityManager: EntityManager,
  ) {}
}
