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
} from '@app/deep-orm';
import { MomentEntity } from '@app/deep-orm/entities/moment.entity';
import { MomentCommentEntity } from '@app/deep-orm/entities/momentComment.entity';

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
      MomentEntity,
      MomentCommentEntity,
    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
