import { Global, Module } from '@nestjs/common';
import { CacheService } from './deep-cache.service';
import { createClient } from 'redis';
import { REDIS_CLIENT } from './constant';
@Global()
@Module({
  providers: [
    CacheService,
    {
      provide: REDIS_CLIENT,
      async useFactory() {
        const client = createClient({
          socket: {
            host: '127.0.0.1',
            port: 6379,
          },
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}