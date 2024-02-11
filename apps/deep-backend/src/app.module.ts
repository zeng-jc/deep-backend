import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { verifyTokenMiddleware } from '@app/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { CheckResourceOwnershipGuard } from './common/guard/checkResourceOwnership.guard';
import { DeepDbModule } from '@app/deep-db';
import { CacheModule } from '@app/deep-cache';
import { SecretKeyModule } from '@app/common/secretKey/secretKey.module';

@Module({
  imports: [DeepDbModule, CacheModule, DatabaseModule, SecretKeyModule, UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CheckResourceOwnershipGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // post、delete、put、patch 请求必须需要登录
    consumer
      .apply(verifyTokenMiddleware)
      .forRoutes(
        { path: '*', method: RequestMethod.DELETE },
        { path: '*', method: RequestMethod.PUT },
        { path: '*', method: RequestMethod.PATCH },
        { path: '*', method: RequestMethod.POST },
      );
  }
}
