import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CacheService } from '@app/deep-cache';

@Injectable()
export class StatsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}
  // 统计用户模块
  async statsUser() {
    const total = await this.database.userRepo.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 设置时间为当天的0点
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // 设置时间为第二天的0点
    const todayCount = await this.database.userRepo
      .createQueryBuilder('user')
      .where('user.createTime >= :startOfDay', { startOfDay: today })
      .andWhere('user.createTime < :endOfDay', { endOfDay: tomorrow })
      .getCount();
    return {
      total,
      todayCount,
    };
  }

  // 统计动态模块
  async statsMoment() {
    const total = await this.database.momentRepo.count();
    const commentCount = await this.database.momentCommentRepo.count();
    const likesCount = await this.database.momentLikesRepo.count();
    const viewsCount = await this.database.momentRepo.sum('viewCount');
    return {
      total,
      commentCount,
      likesCount,
      viewsCount,
    };
  }

  // 统计文章模块
  async statsArticle() {
    const total = await this.database.articleRepo.count();
    const commentCount = await this.database.articleCommentRepo.count();
    const likesCount = await this.database.articleLikesRepo.count();
    const viewsCount = await this.database.articleRepo.sum('viewCount');
    return {
      total,
      commentCount,
      likesCount,
      viewsCount,
    };
  }

  // 统计问答模块
  async statsQuestionAnswer() {
    const questionTotal = await this.database.questionRepo.count();
    return {
      questionTotal,
    };
  }

  // 统计访问量
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
    const user = await this.statsUser();
    const moment = await this.statsMoment();
    const article = await this.statsArticle();
    const visits = await this.getVisits();
    const questionAnswer = await this.statsQuestionAnswer();
    const allData = {
      user,
      moment,
      article,
      visits,
      questionAnswer,
    };
    // 缓存5分钟
    this.cacheService.set(cacheKey, allData, 60 * 5);
    return allData;
  }
}
