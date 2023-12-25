import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { CacheModule } from '@app/deep-cache';
import { DeepAmqpModule } from '@app/deep-amqp';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { AuthGuard } from './common/guard/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '123',
      database: 'coderhub',
      retryDelay: 500, //重试连接数据库间隔
      retryAttempts: 10, //重试连接数据库的次数
      synchronize: true,
      autoLoadEntities: true,
    }),
    CacheModule,
    DeepAmqpModule,
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
