import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from './permission.service';
import { DeepHttpException, cmsStatusCode } from '@app/common';
import { CacheService } from '@app/cache';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
    private readonly cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 从当前处理的控制器类和控制器方法查找元数据permissions的值（注意没绑定permissions，查询出来值为undefined）
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getClass(), context.getHandler()],
    );
    if (!requiredPermissions) return true;

    // 需要通过token拿到用户信息，这里暂时写死，就当登录的是id为1的用户
    const userId = 1;
    const cachePermissions = await this.cacheService.get<string[]>(
      `permission.guard.${userId}`,
    );

    let permissions;
    if (cachePermissions) {
      permissions = cachePermissions;
    } else {
      permissions = await this.permissionService.findPermissions(userId);
      this.cacheService.set<string[]>(
        `permission.guard.${userId}`,
        permissions ?? [],
        1000 * 60,
      );
    }

    const isContainPermission = requiredPermissions.every(
      (item) => permissions?.includes(item),
    );

    if (!isContainPermission) {
      throw new DeepHttpException('权限不足', cmsStatusCode.PERMISSION_DENIED);
    }
    return true;
  }
}
