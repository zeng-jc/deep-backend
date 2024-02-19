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
  MenuEntity,
  MomentLikesEntity,
  UserFollowEntity,
} from '@app/deep-orm';

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
    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}