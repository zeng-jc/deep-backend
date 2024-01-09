import { Module, ValidationPipe } from '@nestjs/common';
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

@Module({
  imports: [
    DeepDbModule,
    CacheModule,
    DeepAmqpModule,
    DatabaseModule,
    UserModule,
    ArticleModule,
    RoleModule,
    PermissionModule,
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
export class AppModule {}
