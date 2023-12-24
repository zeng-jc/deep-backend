import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from './permission.service';
import { DeepHttpException, cmsStatusCode } from '@app/common';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 从当前处理的控制器类和控制器方法查找元数据permissions的值（注意没绑定permissions，查询出来值为undefined）
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getClass(), context.getHandler()],
    );
    if (!requiredPermissions) return true;
    // 用户信息可以通过解析token之后拿到，这里暂时写死，就当登录的是id为1的用户
    const permissions = await this.permissionService.findPermissions(1);
    const isContainPermission = requiredPermissions.every((item) =>
      permissions.includes(item),
    );
    if (!isContainPermission) {
      throw new DeepHttpException('权限不足', cmsStatusCode.PERMISSION_DENIED);
    }
    return true;
  }
}
