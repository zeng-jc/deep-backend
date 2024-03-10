import { Controller, Get, Post, Body, Param, Delete, Headers } from '@nestjs/common';
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
  create(@Headers() headers, @Body() createMomentCommentDto: CreateMomentCommentDto) {
    const { id: userId }: { id: string } = JSON.parse(headers.authorization);
    return this.momentCommentService.create(createMomentCommentDto, userId);
  }

  @Get('/list')
  findMomentCommentList(@Param(new PaginationPipe()) query: PaginationQueryDto) {
    return this.momentCommentService.findMomentCommentList(query);
  }

  @Get(':id')
  findOneMomentComment(@Param('id') id: string) {
    return this.momentCommentService.findOneMomentComment(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.momentCommentService.remove(+id);
  }

  // 切换点赞
  @Post('toggle-likes/:id')
  toggleLikes(@Headers() headers, @Param('id') id: string) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.momentCommentService.toggleLikes(userId + '', id);
  }
}
