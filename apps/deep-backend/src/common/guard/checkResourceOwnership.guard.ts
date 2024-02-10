import {
  CanActivate,
  ExecutionContext,
  Global,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  DeepHttpException,
  AuthErrorCode,
  AuthErrorMsg,
} from '@app/common/exceptionFilter';
import { CacheService } from '@app/deep-cache';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import { TokenPayload } from '@app/common';

@Global()
@Injectable()
export class CheckResourceOwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
    private readonly cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    // 对DELETE、PUT、PATCH请求进行验证资源是否属于自己
    const isWriteOperation = ['DELETE', 'PUT', 'PATCH'].includes(req.method);
    if (!isWriteOperation) return true;

    // 从控制器的元数据中拿到表明
    const tableName = this.reflector.get<string>(
      'tableName',
      context.getClass(),
    );

    const { id: reqUserId }: TokenPayload = JSON.parse(
      req.headers.authorization,
    );
    const resourceId: string = req.params.id;

    const cacheKey = `checkResourceOwnership.guard.${reqUserId}`;

    const cacheUserId: number | null =
      await this.cacheService.get<number>(cacheKey);
    if (cacheUserId && reqUserId !== cacheUserId) {
      throw new DeepHttpException(
        AuthErrorMsg.YOU_DO_NOT_OWN_THIS_RESOURCE,
        AuthErrorCode.YOU_DO_NOT_OWN_THIS_RESOURCE,
      );
    }
    if (cacheUserId && reqUserId === cacheUserId) {
      return true;
    }
    const { userId: dbUserId } = await this.dataSource
      .getRepository(tableName)
      .findOne({
        where: {
          id: resourceId,
        },
      });
    if (reqUserId !== dbUserId) {
      throw new DeepHttpException(
        AuthErrorMsg.YOU_DO_NOT_OWN_THIS_RESOURCE,
        AuthErrorCode.YOU_DO_NOT_OWN_THIS_RESOURCE,
      );
    }
    this.cacheService.set<number>(cacheKey, dbUserId, 60);
    return true;
  }
}
