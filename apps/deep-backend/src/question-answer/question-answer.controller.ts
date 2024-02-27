import { Controller, Get, Post, Body, Param, Delete, Headers, Query } from '@nestjs/common';
import { QuestionAnswerService } from './question-answer.service';
import { CreateQuestionAnswerDto } from './dto/create-question-answer.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';

@ApiTags('question-answer')
@Controller('question-answer')
export class QuestionAnswerController {
  constructor(private readonly questionAnswerService: QuestionAnswerService) {}

  // 创建问题
  @Post()
  createQuestion(@Headers() headers, @Body() createQuestionAnswerDto: CreateQuestionAnswerDto) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.questionAnswerService.createQuestion(userId, createQuestionAnswerDto);
  }

  // 创建答案
  @Post(':id')
  createAnswer(@Headers() headers, @Param('id') id: string, @Body() createQuestionAnswerDto: CreateQuestionAnswerDto) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.questionAnswerService.createAnswer(userId, +id, createQuestionAnswerDto);
  }

  // 多个问题
  @Get('question')
  findMultiQuestion(@Query() paginationParams: PaginationQueryDto) {
    return this.questionAnswerService.findMultiQuestion(paginationParams);
  }

  // 查询单个问题
  @Get('question/:id')
  findOneQuestion(@Param('id') id: string) {
    return this.questionAnswerService.findOneQuestion(+id);
  }

  // 分页查询指定问题的答案
  @Get('answer/:id')
  findQuestionAnswer(@Param('id') id: string, @Query() paginationParams: PaginationQueryDto) {
    return this.questionAnswerService.findQuestionAnswer(+id, paginationParams);
  }

  @Delete('question/:id')
  removeQuestion(@Param('id') id: string) {
    return this.questionAnswerService.removeQuestion(+id);
  }

  @Delete('answer/:id')
  removeAnswer(@Param('id') id: string) {
    return this.questionAnswerService.removeAnswer(+id);
  }
}
