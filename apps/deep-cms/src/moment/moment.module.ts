import { Module } from '@nestjs/common';
import { MomentService } from './moment.service';
import { MomentController } from './moment.controller';

@Module({
  controllers: [MomentController],
  providers: [MomentService],
})
export class MomentModule {}
