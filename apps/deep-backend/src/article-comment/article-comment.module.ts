import { Module } from '@nestjs/common';
import { ArticleCommentService } from './article-comment.service';
import { ArticleCommentController } from './article-comment.controller';

@Module({
  controllers: [ArticleCommentController],
  providers: [ArticleCommentService],
})
export class ArticleCommentModule {}
