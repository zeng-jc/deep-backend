import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { MenuEntity } from '@app/deep-orm/entities/menu.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
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
    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
