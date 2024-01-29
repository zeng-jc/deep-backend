import { Injectable } from '@nestjs/common';
import { CreateMomentCommentDto } from './dto/create-moment-comment.dto';
import { DatabaseService } from '../database/database.service';
import { MomentCommentEntity } from '@app/deep-orm';
import {
  CmsErrorCode,
  CmsErrorMsg,
  DeepHttpException,
} from '@app/common/exceptionFilter';

@Injectable()
export class MomentCommentService {
  constructor(private readonly database: DatabaseService) {}
  async create(createMomentCommentDto: CreateMomentCommentDto) {
    const { userId, momentId, content, replyId } = createMomentCommentDto;
    const comment = new MomentCommentEntity();
    comment.momentId = parseInt(momentId);
    comment.userId = parseInt(userId);
    comment.content = content;
    comment.replyId = Number(replyId ?? null);
    try {
      return await this.database.momentCommentRepo.save(comment);
    } catch (error) {
      throw new DeepHttpException(
        CmsErrorMsg.COMMONET_PARAMETER_VALUE_ERROR,
        CmsErrorCode.COMMONET_PARAMETER_VALUE_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all momentComment`;
  }

  async findOne(id: number) {
    const [data, total] = await this.database.momentCommentRepo.findAndCount({
      where: {
        momentId: id,
      },
      relations: ['user'],
    });
    return {
      data,
      total,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} momentComment`;
  }
}
