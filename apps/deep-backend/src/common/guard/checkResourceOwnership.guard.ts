import { CanActivate, ExecutionContext, Global, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DeepHttpException, ErrorCode, ErrorMsg } from '@app/common/exceptionFilter';
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

    // 从控制器的元数据中拿到表名
    const tableName = this.reflector.get<string>('tableName', context.getClass());

    const { id: reqUserId }: TokenPayload = JSON.parse(req.headers.authorization);
    // TODO：id后续都会携带在请求体中
    const resourceId: string = req.params.id;

    const cacheKey = `checkResourceOwnership.guard.${reqUserId}.${tableName},${resourceId}`;

    const cacheUserId: number | null = await this.cacheService.get<number>(cacheKey);
    if (cacheUserId && reqUserId !== cacheUserId) {
      throw new DeepHttpException(ErrorMsg.YOU_DO_NOT_OWN_THIS_RESOURCE, ErrorCode.YOU_DO_NOT_OWN_THIS_RESOURCE);
    }
    if (cacheUserId && reqUserId === cacheUserId) {
      return true;
    }
    const dbUserId = await this.getUserId(tableName, resourceId);
    if (reqUserId !== dbUserId) {
      throw new DeepHttpException(ErrorMsg.YOU_DO_NOT_OWN_THIS_RESOURCE, ErrorCode.YOU_DO_NOT_OWN_THIS_RESOURCE);
    }
    this.cacheService.set<number>(cacheKey, dbUserId, 60);
    return true;
  }

  async getUserId(tableName: string, resourceId: string): Promise<number> {
    if (tableName === 'user') {
      const { id } = await this.dataSource.getRepository(tableName).findOne({
        where: {
          id: resourceId,
        },
        select: ['id'],
      });
      return id;
    } else {
      const { userId } = await this.dataSource.getRepository(tableName).findOne({
        where: {
          id: resourceId,
        },
        select: ['userId'],
      });
      return userId;
    }
  }
}
