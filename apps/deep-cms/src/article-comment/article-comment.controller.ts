import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ArticleCommentService } from './article-comment.service';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import { PaginationPipe } from '../common/pipe/pagination.pipe';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';

@Controller('article-comment')
export class ArticleCommentController {
  constructor(private readonly articleCommentService: ArticleCommentService) {}

  @Post()
  create(@Body() createArticleCommentDto: CreateArticleCommentDto) {
    return this.articleCommentService.create(createArticleCommentDto);
  }

  @Get()
  findMultiCommentComment(
    @Param(new PaginationPipe()) query: PaginationQueryDto,
  ) {
    return this.articleCommentService.findMultiCommentComment(query);
  }

  @Get(':id')
  findOneArticleComment(@Param('id') id: string) {
    return this.articleCommentService.findOneArticleComment(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleCommentService.remove(+id);
  }
}
