import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity, UserEntity } from '@app/deep-orm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity, UserEntity])],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
