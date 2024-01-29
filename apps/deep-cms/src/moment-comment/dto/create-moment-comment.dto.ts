import { IsNotEmpty } from 'class-validator';

export class CreateMomentCommentDto {
  @IsNotEmpty()
  userId!: string;
  @IsNotEmpty()
  momentId!: string;
  @IsNotEmpty()
  content!: string;
  replyId?: string;
}
