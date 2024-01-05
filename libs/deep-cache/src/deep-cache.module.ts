import { Global, Module } from '@nestjs/common';
import { CacheService } from './deep-cache.service';
import { createClient } from 'redis';
import { REDIS_CLIENT } from './constant';
import { cacheConfig } from './deep-cache.config';
@Global()
@Module({
  providers: [
    CacheService,
    {
      provide: REDIS_CLIENT,
      async useFactory() {
        const client = createClient(cacheConfig);
        await client.connect();
        return client;
      },
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
