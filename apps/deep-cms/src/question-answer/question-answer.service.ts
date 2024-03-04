import { Injectable } from '@nestjs/common';
import { CreateQuestionAnswerDto } from './dto/create-question-answer.dto';
import { DatabaseService } from '../database/database.service';
import { CacheService } from '@app/deep-cache';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';

@Injectable()
export class QuestionAnswerService {
  constructor(
    private readonly database: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}
  createQuestion(userId: number, createQuestionAnswerDto: CreateQuestionAnswerDto) {
    const { content } = createQuestionAnswerDto;
    return this.database.questionRepo.save({ content, userId });
  }

  createAnswer(userId: number, questionId: number, createQuestionAnswerDto: CreateQuestionAnswerDto) {
    const { content } = createQuestionAnswerDto;
    return this.database.answerRepo.save({ userId, questionId, content });
  }

  async findQuestionList(paginationParams: PaginationQueryDto) {
    const { pagenum, pagesize, keywords } = paginationParams;
    let query = this.database.questionRepo
      .createQueryBuilder('question')
      .orderBy('question.id', 'DESC')
      .skip(+pagesize * (+pagenum - 1))
      .take(+pagesize);
    if (keywords) {
      query = query.where('question.content LIKE :keywords', { keywords: `%${keywords}%` });
    }
    const [questions, total] = await query.getManyAndCount();
    return { questions, total };
  }

  findOneQuestion(id: number) {
    return this.database.questionRepo.findOne({ where: { id } });
  }

  async findQuestionAnswer(questionId: number, paginationParams: PaginationQueryDto) {
    const { pagenum, pagesize, keywords } = paginationParams;
    let query = this.database.answerRepo
      .createQueryBuilder('answer')
      .orderBy('answer.id', 'DESC')
      .skip(+pagesize * (+pagenum - 1))
      .take(+pagesize);
    if (keywords) {
      query = query.where('answer.content LIKE :keywords', { keywords: `%${keywords}%` });
    }
    const [answers, total] = await query.getManyAndCount();
    return { answers, total };
  }

  removeQuestion(id: number) {
    return this.database.questionRepo.delete(id);
  }

  removeAnswer(id: number) {
    return this.database.answerRepo.delete(id);
  }
}
