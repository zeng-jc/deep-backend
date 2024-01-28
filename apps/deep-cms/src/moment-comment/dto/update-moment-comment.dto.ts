import { PartialType } from '@nestjs/mapped-types';
import { CreateMomentCommentDto } from './create-moment-comment.dto';

export class UpdateMomentCommentDto extends PartialType(
  CreateMomentCommentDto,
) {}
