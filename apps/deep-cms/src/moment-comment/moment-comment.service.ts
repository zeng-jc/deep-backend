import { Injectable } from '@nestjs/common';
import { CreateMomentCommentDto } from './dto/create-moment-comment.dto';
import { UpdateMomentCommentDto } from './dto/update-moment-comment.dto';

@Injectable()
export class MomentCommentService {
  create(createMomentCommentDto: CreateMomentCommentDto) {
    return 'This action adds a new momentComment' + createMomentCommentDto;
  }

  findAll() {
    return `This action returns all momentComment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} momentComment`;
  }

  update(id: number, updateMomentCommentDto: UpdateMomentCommentDto) {
    return (
      `This action updates a #${id} momentComment` + updateMomentCommentDto
    );
  }

  remove(id: number) {
    return `This action removes a #${id} momentComment`;
  }
}
