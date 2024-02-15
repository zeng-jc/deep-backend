import { Controller, Get, Post, Body, Param, Delete, Headers } from '@nestjs/common';
import { ArticleCommentService } from './article-comment.service';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import { PaginationPipe } from '../common/pipe/pagination.pipe';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { Roles } from '../common/decorator/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Roles('admin')
@ApiTags('article-comment')
@Controller('article-comment')
export class ArticleCommentController {
  constructor(private readonly articleCommentService: ArticleCommentService) {}

  @Post()
  create(@Headers() headers, @Body() createArticleCommentDto: CreateArticleCommentDto) {
    const { id: userId }: { id: string } = JSON.parse(headers.authorization);
    return this.articleCommentService.create(createArticleCommentDto, userId);
  }

  @Get()
  findMultiCommentComment(@Param(new PaginationPipe()) query: PaginationQueryDto) {
    return this.articleCommentService.findMultiArticleComment(query);
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
