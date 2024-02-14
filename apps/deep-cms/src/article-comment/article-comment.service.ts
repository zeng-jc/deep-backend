import { Injectable } from '@nestjs/common';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import { DatabaseService } from '../database/database.service';
import { ArticleCommentEntity } from '@app/deep-orm';
import { CmsErrorCode, CmsErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { Like } from 'typeorm';

@Injectable()
export class ArticleCommentService {
  constructor(private readonly database: DatabaseService) {}
  async create(createArticleCommentDto: CreateArticleCommentDto) {
    const { userId, articleId, content, replyId } = createArticleCommentDto;
    const comment = new ArticleCommentEntity();
    comment.articleId = parseInt(articleId);
    comment.userId = parseInt(userId);
    comment.content = content;
    comment.replyId = Number(replyId ?? null);
    try {
      return await this.database.articleCommentRepo.save(comment);
    } catch (error) {
      throw new DeepHttpException(CmsErrorMsg.ARTICLE_PARAMETER_VALUE_ERROR, CmsErrorCode.ARTICLE_PARAMETER_VALUE_ERROR);
    }
  }

  async findMultiCommentComment(query: PaginationQueryDto) {
    const { keywords, pagesize, curpage } = query;
    const [data, total] = await this.database.articleCommentRepo.findAndCount({
      where: {
        content: Like(`%${keywords ?? ''}%`),
      },
      order: { id: 'DESC' },
      skip: Number.parseInt(pagesize) * (Number.parseInt(curpage) - 1),
      take: Number.parseInt(pagesize),
    });
    return {
      data,
      total,
    };
  }

  async findOneArticleComment(id: number) {
    const [data, total] = await this.database.articleCommentRepo.findAndCount({
      where: {
        articleId: id,
      },
      relations: ['user'],
    });
    return {
      data,
      total,
    };
  }

  remove(id: number) {
    return this.database.articleCommentRepo.delete(id);
  }
}
