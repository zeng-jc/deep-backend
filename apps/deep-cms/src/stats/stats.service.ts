import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CacheService } from '@app/deep-cache';

@Injectable()
export class StatsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}
  async userStats() {
    const cacheUserStats = await this.cacheService.get(`stats.userStats`);
    if (cacheUserStats) return cacheUserStats;
    const result = await this.database.userRepo.count();
    this.cacheService.set(`stats.userStats`, result, 30);
    return result;
  }

  async momentStats() {
    const cacheMomentStats = await this.cacheService.get(`stats.momentStats`);
    if (cacheMomentStats) return cacheMomentStats;
    const momentCount = await this.database.momentRepo.count();
    const momentCommentCount = await this.database.momentCommentRepo.count();
    const momentLikesCount = await this.database.momentLikesRepo.count();
    const momentViewsCount = await this.database.momentRepo.sum('viewCount');
    const result = {
      momentCount,
      momentCommentCount,
      momentLikesCount,
      momentViewsCount,
    };
    this.cacheService.set(`stats.momentStats`, result, 30);
    return result;
  }

  async articleStats() {
    const cacheArticleStats = await this.cacheService.get(`stats.ArticleStats`);
    if (cacheArticleStats) return cacheArticleStats;
    const articleCount = await this.database.articleRepo.count();
    const articleCommentCount = await this.database.articleCommentRepo.count();
    const articleLikesCount = await this.database.articleLikesRepo.count();
    const articleViewsCount = await this.database.articleRepo.sum('viewCount');
    const result = {
      articleCount,
      articleCommentCount,
      articleLikesCount,
      articleViewsCount,
    };
    this.cacheService.set(`stats.ArticleStats`, result, 30);
    return result;
  }

  async visits() {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `dailyVisits.${today}`;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const cacheCount = await this.cacheService.getCounter(cacheKey);
    // 今日访问量
    const todayVisits =
      cacheCount + (await this.database.dailyVisitsRepo.findOne({ select: ['count'], where: { date: today } }))?.count ?? 0;
    // 查缓存
    const cacheVal = await this.cacheService.get<{ yesterdayVisits: number; todayVisits: number }>('stats.visits');
    if (cacheVal)
      return {
        ...cacheVal,
        todayVisits,
      };
    // 昨日访问量
    const yesterdayVisits =
      (await this.database.dailyVisitsRepo.findOne({ select: ['count'], where: { date: yesterday } }))?.count ?? 0;
    // 总访问量
    const { count: totalVisits } = await this.database.dailyVisitsRepo
      .createQueryBuilder('dailyVisits')
      .select('SUM(dailyVisits.count)', 'count')
      .getRawOne();
    // 缓存30分钟
    this.cacheService.set('stats.visits', { yesterdayVisits, todayVisits }, 60 * 30);
    return {
      yesterdayVisits,
      todayVisits,
      totalVisits,
    };
  }
}
