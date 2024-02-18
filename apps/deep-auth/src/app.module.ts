import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DeepDbModule } from '@app/deep-orm';
import { DatabaseModule } from './database/database.module';
import { SecretKeyModule } from '@app/common/secretKey/secretKey.module';

@Module({
  imports: [DeepDbModule, DatabaseModule, AuthModule, SecretKeyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
