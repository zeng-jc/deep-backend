import { Module } from '@nestjs/common';
import { DeepOrmService } from './deep-orm.service';

@Module({
  providers: [DeepOrmService],
  exports: [DeepOrmService],
})
export class DeepOrmModule {}
