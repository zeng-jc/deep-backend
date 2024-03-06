import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CacheService } from '@app/deep-cache';

@Injectable()
export class StatsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}
  async getMomentCount() {
    const count = await this.database.momentRepo.count();
    const commentCount = await this.database.momentCommentRepo.count();
    const likesCount = await this.database.momentLikesRepo.count();
    const viewsCount = await this.database.momentRepo.sum('viewCount');
    return {
      count,
      commentCount,
      likesCount,
      viewsCount,
    };
  }
  async getArticleCount() {
    const count = await this.database.articleRepo.count();
    const commentCount = await this.database.articleCommentRepo.count();
    const likesCount = await this.database.articleLikesRepo.count();
    const viewsCount = await this.database.articleRepo.sum('viewCount');
    return {
      count,
      commentCount,
      likesCount,
      viewsCount,
    };
  }

  async getVisits() {
    const todayDate = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const cacheKey = `dailyVisits.${todayDate}`;
    const cacheCount = await this.cacheService.getCounter(cacheKey);
    // 今日访问量
    const today =
      cacheCount + ((await this.database.dailyVisitsRepo.findOne({ select: ['count'], where: { date: todayDate } }))?.count ?? 0);
    // 昨日访问量
    const yesterday =
      (await this.database.dailyVisitsRepo.findOne({ select: ['count'], where: { date: yesterdayDate } }))?.count ?? 0;
    // 总访问量
    let { count: total } = await this.database.dailyVisitsRepo
      .createQueryBuilder('dailyVisits')
      .select('SUM(dailyVisits.count)', 'count')
      .getRawOne();
    total = parseInt(total, 10);
    return {
      today,
      yesterday,
      total,
    };
  }

  async statsAll() {
    const cacheKey = 'stats.all';
    const cacheStatsAll = await this.cacheService.get(cacheKey);
    if (cacheStatsAll) return cacheStatsAll;
    const userCount = await this.database.userRepo.count();
    const moment = await this.getMomentCount();
    const article = await this.getArticleCount();
    const visits = await this.getVisits();
    const allData = {
      userCount,
      moment,
      article,
      visits,
    };
    // 缓存5分钟
    this.cacheService.set(cacheKey, allData, 60 * 5);
    return allData;
  }
}
