import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleCommentDto } from './create-article-comment.dto';

export class UpdateArticleCommentDto extends PartialType(CreateArticleCommentDto) {}
