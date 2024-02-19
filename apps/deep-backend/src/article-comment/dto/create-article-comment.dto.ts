import { IsNotEmpty } from 'class-validator';
export class CreateArticleCommentDto {
  @IsNotEmpty()
  userId!: string;
  @IsNotEmpty()
  articleId!: string;
  @IsNotEmpty()
  content!: string;
  replyId?: string;
}
