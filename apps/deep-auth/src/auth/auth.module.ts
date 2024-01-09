import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ArticleEntity,
  AvatarEntity,
  PermissionEntity,
  RoleEntity,
  UserEntity,
} from '@app/deep-orm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AvatarEntity,
      RoleEntity,
      PermissionEntity,
      ArticleEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
