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
    if (
      !(
        req.method === 'DELETE' ||
        req.method === 'PUT' ||
        req.method === 'PATCH'
      )
    )
      return true;
    const tableName = this.reflector.get<string>(
      'tableName',
      context.getClass(),
    );
    const { id: userId }: TokenPayload = JSON.parse(req.headers.authorization);
    const resourceId = req.params.id;
    const res = await this.dataSource.getRepository(tableName).findOne({
      where: {
        id: resourceId,
      },
    });
    if (!(res.userId === userId)) {
      throw new DeepHttpException(
        AuthErrorMsg.YOU_DO_NOT_OWN_THIS_RESOURCE,
        AuthErrorCode.YOU_DO_NOT_OWN_THIS_RESOURCE,
      );
    }
    return true;
  }
}
