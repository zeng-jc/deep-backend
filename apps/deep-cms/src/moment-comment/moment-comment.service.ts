import { Injectable } from '@nestjs/common';
import { CreateMomentCommentDto } from './dto/create-moment-comment.dto';
import { DatabaseService } from '../database/database.service';
import { MomentCommentEntity } from '@app/deep-orm';
import { CmsErrorCode, CmsErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { Like } from 'typeorm';
import { DeepMinioService } from '@app/deep-minio';
const bucketName = 'deep-moment';

@Injectable()
export class MomentCommentService {
  constructor(
    private readonly database: DatabaseService,
    private readonly deepMinioService: DeepMinioService,
  ) {}
  async create(createMomentCommentDto: CreateMomentCommentDto, userId: string) {
    const { momentId, content, replyId } = createMomentCommentDto;
    const comment = new MomentCommentEntity();
    comment.momentId = +momentId;
    comment.userId = +userId;
    comment.content = content;
    comment.replyId = Number(replyId ?? null);
    try {
      return await this.database.momentCommentRepo.save(comment);
    } catch (error) {
      throw new DeepHttpException(CmsErrorMsg.MOMENT_PARAMETER_VALUE_ERROR, CmsErrorCode.MOMENT_PARAMETER_VALUE_ERROR);
    }
  }

  // 评论搜索（不查头像，影响性能）
  async findMultiMomentComment(query: PaginationQueryDto) {
    const { keywords, pagesize, curpage } = query;
    const [data, total] = await this.database.momentCommentRepo.findAndCount({
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
  // 查询指定动态的所有评论
  async findOneMomentComment(momentId: number) {
    const [data, total] = await this.database.momentCommentRepo.findAndCount({
      where: {
        momentId,
      },
      relations: ['user'],
    });
    await Promise.all(
      data.map(
        async (comment) =>
          (comment.user.avatar =
            comment.user.avatar && (await this.deepMinioService.getFileUrl(comment.user.avatar, bucketName))),
      ),
    );
    return {
      data,
      total,
    };
  }

  // TODO：还需要删除子评论
  remove(id: number) {
    return this.database.momentCommentRepo.delete(id);
  }
}
