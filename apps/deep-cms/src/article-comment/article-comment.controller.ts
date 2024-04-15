import { Controller, Get, Post, Body, Param, Delete, Headers, Query } from '@nestjs/common';
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

  @Post('/create')
  create(@Headers() headers, @Body() createArticleCommentDto: CreateArticleCommentDto) {
    const { id: userId }: { id: string } = JSON.parse(headers.authorization);
    return this.articleCommentService.create(createArticleCommentDto, userId);
  }

  @Get('/list')
  findArticleCommentList(@Query(new PaginationPipe()) query: PaginationQueryDto) {
    return this.articleCommentService.findArticleCommentList(query);
  }

  @Get(':articleId')
  findArticleComment(@Param('articleId') articleId: string) {
    return this.articleCommentService.findArticleComment(+articleId);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.articleCommentService.remove(+id);
  }

  // 切换点赞
  @Post('/toggle-likes/:id')
  toggleLikes(@Headers() headers, @Param('id') id: string) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.articleCommentService.toggleLikes(userId + '', id);
  }
}
