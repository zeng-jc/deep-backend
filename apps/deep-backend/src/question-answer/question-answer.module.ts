import { Module } from '@nestjs/common';
import { QuestionAnswerService } from './question-answer.service';
import { QuestionAnswerController } from './question-answer.controller';

@Module({
  controllers: [QuestionAnswerController],
  providers: [QuestionAnswerService],
})
export class QuestionAnswerModule {}
