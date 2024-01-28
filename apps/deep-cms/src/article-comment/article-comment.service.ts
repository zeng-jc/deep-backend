import { Injectable } from '@nestjs/common';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import { UpdateArticleCommentDto } from './dto/update-article-comment.dto';

@Injectable()
export class ArticleCommentService {
  create(createArticleCommentDto: CreateArticleCommentDto) {
    return 'This action adds a new articleComment' + createArticleCommentDto;
  }

  findAll() {
    return `This action returns all articleComment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleComment`;
  }

  update(id: number, updateArticleCommentDto: UpdateArticleCommentDto) {
    return (
      `This action updates a #${id} articleComment` + updateArticleCommentDto
    );
  }

  remove(id: number) {
    return `This action removes a #${id} articleComment`;
  }
}
