import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
  Headers,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorator/auth.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { GetBodyIdPipe } from '../common/pipe/getBodyId.pipe';
import { PaginationPipe } from '../common/pipe/pagination.pipe';

@Roles('admin')
@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 9 },
        { name: 'cover', maxCount: 1 },
      ],
      {
        limits: {
          fileSize: 4 * 1024 * 1024,
        },
      },
    ),
  )
  createArticle(
    @Headers() headers,
    @UploadedFiles() files: { images?: Express.Multer.File[]; cover?: Express.Multer.File[] },
    @Body() createArticleDto: CreateArticleDto,
  ) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.articleService.createArticle(userId, files, createArticleDto);
  }

  @Get('/list')
  findArticleList(@Query(new PaginationPipe()) paginationParams: PaginationQueryDto) {
    return this.articleService.findArticleList(paginationParams);
  }

  @Get(':id')
  findOneArticle(@Param('id') id: string) {
    return this.articleService.findOneArticle(+id);
  }

  @Delete('/delete/:id')
  removeArticle(@Param('id') id: string) {
    return this.articleService.removeArticle(+id);
  }

  @Post('/change-status')
  changeArticleStatus(@Body(new GetBodyIdPipe()) id: string) {
    return this.articleService.changeArticleStatus(id);
  }

  // 切换点赞
  @Post('/toggle-likes/:id')
  toggleLikes(@Headers() headers, @Param('id') id: string) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.articleService.toggleLikes(userId, +id);
  }

  @Patch('/update/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 9 },
        { name: 'cover', maxCount: 1 },
      ],
      {
        limits: {
          fileSize: 4 * 1024 * 1024,
        },
      },
    ),
  )
  updateArticle(
    @Param('id') id: string,
    @UploadedFiles() files: { images?: Express.Multer.File[]; cover?: Express.Multer.File[] },
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(+id, updateArticleDto, files);
  }

  @Get('/label/list')
  findArticleLabelList(@Query(new PaginationPipe()) paginationParams: PaginationQueryDto) {
    return this.articleService.findArticleLabelList(paginationParams);
  }

  @Delete('/label/delete/:id')
  deleteArticleLabelList(@Param('id') id: string) {
    return this.articleService.deleteArticleLabelList(+id);
  }

  @Post('/label/create')
  createArticleLabelList(@Headers() headers, @Body() { name }: { name: string }) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.articleService.createArticleLabelList(+userId, name);
  }
}
