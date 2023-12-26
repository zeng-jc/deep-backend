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
} from '@app/common/ExceptionFilter';
import { CacheService } from '@app/deep-cache';
import { DataSource } from 'typeorm';
import { UserEntity } from '@app/deep-orm';

@Global()
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
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
      const users = await this.dataSource.getRepository(UserEntity).findOne({
        where: {
          id: userId,
        },
        relations: ['roles', 'roles.permissions'],
      });
      permissions = users.roles.flatMap((role) => role.permissions);
      permissions = [...new Set(permissions.map((p) => p.name))];
      this.cacheService.set<string[]>(
        `permission.guard.${userId}`,
        permissions ?? [],
        60,
      );
    }

    const isContainPermission = requiredPermissions.every(
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
