import { Injectable } from '@nestjs/common';
import { CreateMomentCommentDto } from './dto/create-moment-comment.dto';
import { DatabaseService } from '../database/database.service';
import { MomentCommentEntity } from '@app/deep-orm';
import { ErrorCode, ErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { Like } from 'typeorm';
import { DeepMinioService } from '@app/deep-minio';
import { bucketNameEnum } from '@app/deep-minio/deep-minio.bucket-name';

const bucketName = bucketNameEnum.deepMoment;

@Injectable()
export class MomentCommentService {
  constructor(
    private readonly database: DatabaseService,
    private readonly deepMinioService: DeepMinioService,
  ) {}
  // 物化路径策略存储评论
  async create(createMomentCommentDto: CreateMomentCommentDto, userId: string) {
    const { momentId, content, replyId } = createMomentCommentDto;
    const comment = new MomentCommentEntity();
    comment.momentId = +momentId;
    comment.userId = +userId;
    comment.content = content;
    if (replyId) {
      // 查询回复的评论是否存在
      const parentComment = await this.database.momentCommentRepo.findOne({ where: { id: +replyId } });
      if (!parentComment) throw new DeepHttpException(ErrorMsg.REPLY_MOMENT_NOT_EXIST, ErrorCode.REPLY_MOMENT_NOT_EXIST);
      // 存储评论并拿出评论信息
      const curComment = await this.database.momentCommentRepo.save(comment);
      // 重新计算评论路径
      curComment.path = (parentComment.path ?? parentComment.id) + '/' + curComment.id;
      curComment.replyId = +replyId;
      // 更新评论路径
      return await this.database.momentCommentRepo.update({ id: curComment.id }, curComment);
    } else {
      await this.database.momentCommentRepo.save(comment);
      return true;
    }
  }

  // 评论搜索（不查头像，影响性能）
  async findMomentCommentList(query: PaginationQueryDto) {
    const { content, pagesize, pagenum } = query;
    const [list, total] = await this.database.momentCommentRepo.findAndCount({
      where: {
        content: Like(`%${content ?? ''}%`),
      },
      order: { id: 'DESC' },
      skip: +pagesize * (+pagenum - 1),
      take: +pagesize,
      relations: ['user', 'moment'],
      select: {
        user: {
          username: true,
        },
        moment: {
          content: true,
        },
      },
    });
    return {
      list,
      total,
    };
  }

  // 查询指定动态的所有评论
  async findOneMomentComment(momentId: number) {
    const [list, total] = await this.database.momentCommentRepo.findAndCount({
      where: {
        momentId,
      },
      relations: ['user'],
    });
    await Promise.all(
      list.map(
        async (comment) =>
          (comment.user.avatar =
            comment.user.avatar && (await this.deepMinioService.getFileUrl(comment.user.avatar, bucketName))),
      ),
    );
    return {
      list,
      total,
    };
  }

  // TODO：已实现删除子评论功能
  async remove(id: number) {
    const curComment = await this.database.momentCommentRepo.findOne({ where: { id } });
    return this.database.momentCommentRepo
      .createQueryBuilder('momentComment')
      .delete()
      .where(`path LIKE '${curComment.path ?? curComment.id + ''}%' OR id = '${curComment.id}'`)
      .execute();
  }

  async toggleLikes(userId: string, momentCommentId: string) {
    try {
      // 1. userId是否存在于likes中（likes存储的是所有点赞用户的id）
      const momentCommetEntity = await this.database.momentCommentRepo.findOne({ where: { id: +momentCommentId } });
      const { likes } = momentCommetEntity;
      // 2. 点赞判断
      if (likes.includes(userId)) {
        likes.splice(likes.indexOf(userId), 1);
      } else {
        likes.push(userId);
      }
      // 3. 更新数据库
      await this.database.momentCommentRepo.save(momentCommetEntity);
      // 4. 返回点赞数量
      return likes.length;
    } catch (error) {
      throw new DeepHttpException(ErrorMsg.DATABASE_HANDLE_ERROR, ErrorCode.DATABASE_HANDLE_ERROR);
    }
  }
}
