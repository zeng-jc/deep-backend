import { IsNotEmpty } from 'class-validator';

export class CreateMomentCommentDto {
  @IsNotEmpty()
  momentId!: string;
  @IsNotEmpty()
  content!: string;
  replyId?: string;
}
