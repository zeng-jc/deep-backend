import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MomentCommentService } from './moment-comment.service';
import { CreateMomentCommentDto } from './dto/create-moment-comment.dto';
import { PaginationPipe } from '../common/pipe/pagination.pipe';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { Roles } from '../common/decorator/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Roles('admin')
@ApiTags('moment-comment')
@Controller('moment-comment')
export class MomentCommentController {
  constructor(private readonly momentCommentService: MomentCommentService) {}

  @Post()
  create(@Body() createMomentCommentDto: CreateMomentCommentDto) {
    return this.momentCommentService.create(createMomentCommentDto);
  }

  @Get()
  findMultiCommentComment(
    @Param(new PaginationPipe()) query: PaginationQueryDto,
  ) {
    return this.momentCommentService.findMultiCommentComment(query);
  }

  @Get(':id')
  findOneMomentComment(@Param('id') id: string) {
    return this.momentCommentService.findOneMomentComment(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.momentCommentService.remove(+id);
  }
}
