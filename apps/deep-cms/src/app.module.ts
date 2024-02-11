import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_PIPE, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { CacheModule } from '@app/deep-cache';
import { DeepAmqpModule } from '@app/deep-amqp';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { AuthGuard } from './common/guard/auth.guard';
import { DeepDbModule } from '@app/deep-db';
import { DatabaseModule } from './database/database.module';
import { SecretKeyModule } from '@app/common/secretKey/secretKey.module';
import { verifyTokenMiddleware } from '@app/common';
import { MomentModule } from './moment/moment.module';
import { MomentCommentModule } from './moment-comment/moment-comment.module';
import { ArticleCommentModule } from './article-comment/article-comment.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    DeepDbModule,
    CacheModule,
    DeepAmqpModule,
    DatabaseModule,
    SecretKeyModule,
    UserModule,
    ArticleModule,
    RoleModule,
    PermissionModule,
    MomentModule,
    MomentCommentModule,
    ArticleCommentModule,
    MinioClientModule,
    MenuModule,
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
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyTokenMiddleware).forRoutes('*');
  }
}
