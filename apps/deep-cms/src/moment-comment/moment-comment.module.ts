import { Module } from '@nestjs/common';
import { MomentCommentService } from './moment-comment.service';
import { MomentCommentController } from './moment-comment.controller';

@Module({
  controllers: [MomentCommentController],
  providers: [MomentCommentService],
})
export class MomentCommentModule {}
