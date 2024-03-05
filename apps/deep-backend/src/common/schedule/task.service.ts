import { CacheService } from '@app/deep-cache';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '../../database/database.service';
import { DAILY_VISITS } from '../constant/cacheKey';

@Injectable()
export class TasksService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly database: DatabaseService,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron('0 1 * * * *')
  async dailyVisitsHandle() {
    // 1.拿到缓存
    const count = await this.cacheService.getCounter(DAILY_VISITS);
    // 2.同步到数据
    const dailyVisits = await this.database.dailyVisitsRepo.findOne({ where: { date: DAILY_VISITS } });
    const countRes = dailyVisits?.count ?? 0 + count;
    this.database.dailyVisitsRepo.update({ date: DAILY_VISITS }, { count: countRes });
    // 3.删除缓存
    this.cacheService.del(DAILY_VISITS);
  }
}
