import { configLoader } from '@app/common/configLoader';
import { RedisClientOptions } from 'redis';

export const cacheConfig: RedisClientOptions = configLoader<RedisClientOptions>('redis');
