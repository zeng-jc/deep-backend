import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from './constant';

@Injectable()
export class CacheService {
  constructor(@Inject(REDIS_CLIENT) private redisClient: RedisClientType) {}
  async incrCounter(key: string): Promise<number> {
    return await this.redisClient.incr(key);
  }

  async getCounter(key: string): Promise<number> {
    const value = await this.redisClient.get(key);
    return value ? parseInt(value, 10) : 0;
  }

  //获取值
  async get<T>(key: string): Promise<T> {
    let value = await this.redisClient.get(key);
    try {
      value = JSON.parse(value);
    } catch (error) {}
    return value as T;
  }

  /**
   * 设置值
   * @param key {string} key
   * @param value 值
   * @param second 过期时间 秒
   * @returns Promise<any>
   */
  async set<T = any>(key: string, value: T, second?: number) {
    const strValue = JSON.stringify(value);
    return await this.redisClient.set(key, strValue, { EX: second });
  }

  //删除值
  async del(key: string) {
    return await this.redisClient.del(key);
  }

  //清除缓存
  async flushall() {
    return await this.redisClient.flushAll();
  }
}
