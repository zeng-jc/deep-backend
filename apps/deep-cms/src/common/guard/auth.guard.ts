import {
  CanActivate,
  ExecutionContext,
  Global,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  DeepHttpException,
  CmsErrorMsg,
  CmsErrorCode,
} from '@app/common/exceptionFilter';
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
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>('roles', [
        context.getClass(),
      ]) ?? [];
    // 从当前处理的控制器类和控制器方法查找元数据permissions的值（注意没绑定permissions，查询出来值为undefined）
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>('permissions', [
        context.getClass(),
        context.getHandler(),
      ]) ?? [];

    // 通过token拿到用户信息
    const req = context.switchToHttp().getRequest<Request>();
    const userInfo: TokenPayload = JSON.parse(req.headers.authorization);

    const { id: userId } = userInfo;

    const cachePermissions = await this.cacheService.get<string[]>(
      `permission.guard.${userId}`,
    );
    const cacheRoles = await this.cacheService.get<string[]>(
      `roles.guard.${userId}`,
    );

    let permissions;
    let roles: string[];
    if (cachePermissions) {
      permissions = cachePermissions;
      roles = cacheRoles;
    } else {
      const users = await this.dataSource.getRepository(UserEntity).findOne({
        where: {
          id: userId,
        },
        relations: ['roles', 'roles.permissions'],
      });

      roles = users.roles.map((role) => role.name);
      this.cacheService.set<string[]>(`roles.guard.${userId}`, roles ?? [], 60);

      permissions = users.roles.flatMap((role) => role.permissions);
      permissions = [...new Set(permissions.map((p) => p.name))];
      this.cacheService.set<string[]>(
        `permission.guard.${userId}`,
        permissions ?? [],
        60,
      );
    }

    // DOTO：暂时写死只有admi的角色才能访问
    const isContainRole: boolean = requiredRoles.every(
      (item) => roles?.includes(item),
    );

    if (!isContainRole) {
      throw new DeepHttpException(
        CmsErrorMsg.ROLE_ACCESS_PROHIBITED,
        CmsErrorCode.ROLE_ACCESS_PROHIBITED,
      );
    }

    const isContainPermission: boolean = requiredPermissions.every(
      (item) => permissions?.includes(item),
    );

    if (!isContainPermission) {
      throw new DeepHttpException(
        CmsErrorMsg.PERMISSION_DENIED,
        CmsErrorCode.PERMISSION_DENIED,
      );
    }
    return true;
  }
}
