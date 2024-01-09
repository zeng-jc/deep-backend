import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DeepDbModule } from '@app/deep-db';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DeepDbModule, DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
