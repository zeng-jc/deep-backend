import { Module } from '@nestjs/common';
import { DeepDbService } from './deep-db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './deep-db.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => dbConfig,
    }),
  ],
  providers: [DeepDbService],
  exports: [DeepDbService],
})
export class DeepDbModule {}
