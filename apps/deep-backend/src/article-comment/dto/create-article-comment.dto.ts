import { IsNotEmpty } from 'class-validator';
export class CreateArticleCommentDto {
  @IsNotEmpty()
  articleId!: string;
  @IsNotEmpty()
  content!: string;
  replyId?: string;
}
