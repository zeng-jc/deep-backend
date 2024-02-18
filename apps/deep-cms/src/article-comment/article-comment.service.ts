import { Injectable } from '@nestjs/common';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import { DatabaseService } from '../database/database.service';
import { ArticleCommentEntity } from '@app/deep-orm';
import { ErrorCode, ErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { Like } from 'typeorm';
import { DeepMinioService } from '@app/deep-minio';
const bucketName = 'deep-article';

@Injectable()
export class ArticleCommentService {
  constructor(
    private readonly database: DatabaseService,
    private readonly deepMinioService: DeepMinioService,
  ) {}
  async create(createArticleCommentDto: CreateArticleCommentDto, userId: string) {
    const { articleId, content, replyId } = createArticleCommentDto;
    const comment = new ArticleCommentEntity();
    comment.articleId = +articleId;
    comment.userId = +userId;
    comment.content = content;
    comment.replyId = Number(replyId ?? null);
    try {
      return await this.database.articleCommentRepo.save(comment);
    } catch (error) {
      throw new DeepHttpException(ErrorMsg.ARTICLE_PARAMETER_VALUE_ERROR, ErrorCode.ARTICLE_PARAMETER_VALUE_ERROR);
    }
  }

  // 评论搜索（不查头像，影响性能）
  async findMultiArticleComment(query: PaginationQueryDto) {
    const { keywords, pagesize, curpage } = query;
    const [data, total] = await this.database.articleCommentRepo.findAndCount({
      where: {
        content: Like(`%${keywords ?? ''}%`),
      },
      order: { id: 'DESC' },
      skip: +pagesize * (+curpage - 1),
      take: +pagesize,
    });
    return {
      data,
      total,
    };
  }
  // 查询指定文章的所有评论
  async findOneArticleComment(articleId: number) {
    const [data, total] = await this.database.articleCommentRepo.findAndCount({
      where: {
        articleId,
      },
      relations: ['user'],
    });
    await Promise.all(
      data.map(
        async (article) =>
          (article.user.avatar =
            article.user.avatar && (await this.deepMinioService.getFileUrl(article.user.avatar, bucketName))),
      ),
    );
    return {
      data,
      total,
    };
  }

  // TODO：还需要删除子评论
  remove(id: number) {
    return this.database.articleCommentRepo.delete(id);
  }
}
