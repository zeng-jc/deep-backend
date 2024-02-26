import { CanActivate, ExecutionContext, Global, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DeepHttpException, ErrorMsg, ErrorCode } from '@app/common/exceptionFilter';
import { CacheService } from '@app/deep-cache';
import { DataSource } from 'typeorm';
import { UserEntity } from '@app/deep-orm';
import { Request } from 'express';
import { TokenPayload } from '@app/common';

@Global()
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
    private readonly cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [context.getClass()]) ?? [];
    // 从当前处理的控制器类和控制器方法查找元数据permissions的值（注意没绑定permissions，查询出来值为undefined）
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>('permissions', [context.getClass(), context.getHandler()]) ?? [];

    // 通过token拿到用户信息
    const req = context.switchToHttp().getRequest<Request>();
    const { id: reqUserId }: TokenPayload = JSON.parse(req.headers.authorization);

    const permissionCacheKey = `permission.guard.${reqUserId}`;
    const roleCacheKey = `roles.guard.${reqUserId}`;

    const cachePermissions = await this.cacheService.get<string[]>(permissionCacheKey);
    const cacheRoles = await this.cacheService.get<string[]>(roleCacheKey);

    let permissions;
    let roles: string[];
    if (cachePermissions) {
      permissions = cachePermissions;
      roles = cacheRoles;
    } else {
      const user = await this.dataSource.getRepository(UserEntity).findOne({
        select: ['id'],
        where: {
          id: reqUserId,
        },
        relations: ['roles', 'roles.permissions'],
      });

      roles = user.roles.map((role) => role.name);
      this.cacheService.set<string[]>(roleCacheKey, roles ?? [], 60);

      permissions = user.roles.flatMap((role) => role.permissions);
      permissions = [...new Set(permissions.map((p) => p.name))];
      this.cacheService.set<string[]>(permissionCacheKey, permissions ?? [], 60);
    }

    const isContainRole: boolean = requiredRoles.every((item) => roles?.includes(item));

    if (!isContainRole) {
      throw new DeepHttpException(ErrorMsg.ROLE_ACCESS_PROHIBITED, ErrorCode.ROLE_ACCESS_PROHIBITED);
    }

    const isContainPermission: boolean = requiredPermissions.every((item) => permissions?.includes(item));

    if (!isContainPermission) {
      throw new DeepHttpException(ErrorMsg.PERMISSION_DENIED, ErrorCode.PERMISSION_DENIED);
    }
    return true;
  }
}
