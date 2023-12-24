import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity, UserEntity } from '@app/deep-orm/entities';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './permission.guard';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity, UserEntity])],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class PermissionModule {}
