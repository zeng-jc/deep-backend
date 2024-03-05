// import { ErrorCode, ErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';
import { CacheService } from '@app/deep-cache';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { DAILY_VISITS } from '../constant/cacheKey';

@Injectable()
export class dailyVisitsMiddleware implements NestMiddleware {
  constructor(private readonly cacheService: CacheService) {}
  use(req: Request, res: Response, next: (error?: unknown) => void) {
    this.cacheService.incrCounter(DAILY_VISITS);
    next();
  }
}
