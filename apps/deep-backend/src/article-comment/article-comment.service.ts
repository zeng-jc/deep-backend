import { Injectable } from '@nestjs/common';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import { DatabaseService } from '../database/database.service';
import { ArticleCommentEntity } from '@app/deep-orm';
import { ErrorCode, ErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';
import { DeepMinioService } from '@app/deep-minio';
import { bucketNameEnum } from '@app/deep-minio/deep-minio.bucket-name';

const bucketName = bucketNameEnum.deepAvatar;

@Injectable()
export class ArticleCommentService {
  constructor(
    private readonly database: DatabaseService,
    private readonly deepMinioService: DeepMinioService,
  ) {}
  // 物化路径策略存储评论
  async create(createArticleCommentDto: CreateArticleCommentDto, userId: string) {
    const { articleId, content, replyId } = createArticleCommentDto;
    const comment = new ArticleCommentEntity();
    comment.articleId = +articleId;
    comment.userId = +userId;
    comment.content = content;
    if (replyId) {
      // 查询回复的评论是否存在
      const parentComment = await this.database.articleCommentRepo.findOne({ where: { id: +replyId } });
      if (!parentComment) throw new DeepHttpException(ErrorMsg.REPLY_ARTICLE_NOT_EXIST, ErrorCode.REPLY_ARTICLE_NOT_EXIST);
      // 存储评论并拿出评论信息
      const curComment = await this.database.articleCommentRepo.save(comment);
      // 重新计算评论路径
      curComment.path = (parentComment.path ?? parentComment.id) + '/' + curComment.id;
      curComment.replyId = +replyId;
      // 更新评论路径
      return await this.database.articleCommentRepo.update({ id: curComment.id }, curComment);
    } else {
      await this.database.articleCommentRepo.save(comment);
      return true;
    }
  }

  // 查询指定文章的所有评论
  async findArticleComment(articleId: number) {
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

  // TODO：已实现删除子评论功能
  async remove(id: number) {
    const curComment = await this.database.articleCommentRepo.findOne({ where: { id } });
    return this.database.articleCommentRepo
      .createQueryBuilder('articleComment')
      .delete()
      .where(`path LIKE '${curComment.path ?? curComment.id}%' OR id = '${curComment.id}'`)
      .execute();
  }

  async toggleLikes(userId: string, articleCommentId: string) {
    try {
      // 1. userId是否存在于likes中（likes存储的是所有点赞用户的id）
      const articleEntity = await this.database.articleCommentRepo.findOne({ where: { id: +articleCommentId } });
      const { likes } = articleEntity;
      // 2. 点赞判断
      if (likes.includes(userId)) {
        likes.splice(likes.indexOf(userId), 1);
      } else {
        likes.push(userId);
      }
      // 3. 更新数据库
      await this.database.articleCommentRepo.save(articleEntity);
      // 4. 返回点赞数量
      return likes.length;
    } catch (error) {
      throw new DeepHttpException(ErrorMsg.DATABASE_HANDLE_ERROR, ErrorCode.DATABASE_HANDLE_ERROR);
    }
  }
}
