import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DeepDbModule } from '@app/deep-orm';
import { DatabaseModule } from './database/database.module';
import { SecretKeyModule } from '@app/common/secretKey/secretKey.module';
import { CacheModule } from '@app/deep-cache';
import { APP_PIPE } from '@nestjs/core';
import { DeepMinioModule } from '@app/deep-minio';

@Module({
  imports: [DeepDbModule, DatabaseModule, AuthModule, SecretKeyModule, CacheModule, DeepMinioModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
