import { MiddlewareConsumer, Module, NestModule, RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { verifyTokenMiddleware } from '@app/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { CheckResourceOwnershipGuard } from './common/guard/checkResourceOwnership.guard';
import { DeepDbModule } from '@app/deep-orm';
import { CacheModule } from '@app/deep-cache';
import { SecretKeyModule } from '@app/common/secretKey/secretKey.module';
import { MomentModule } from './moment/moment.module';
import { DeepMinioModule } from '@app/deep-minio';
import { MomentCommentModule } from './moment-comment/moment-comment.module';
import { ArticleCommentModule } from './article-comment/article-comment.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    DeepDbModule,
    CacheModule,
    DatabaseModule,
    DeepMinioModule,
    SecretKeyModule,
    UserModule,
    MomentModule,
    MomentCommentModule,
    ArticleCommentModule,
    // 定义多个节流阀
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 80,
      },
      {
        name: 'medium',
        ttl: 10 * 1000,
        limit: 300,
      },
      {
        name: 'long',
        ttl: 60 * 1000,
        limit: 900,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: CheckResourceOwnershipGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
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
