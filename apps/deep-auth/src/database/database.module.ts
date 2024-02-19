import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  MomentLikesEntity,
  UserFollowEntity,
  ArticleLikesEntity,
} from '@app/deep-orm';
import { MenuEntity } from '@app/deep-orm/entities/menu.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
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
    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
