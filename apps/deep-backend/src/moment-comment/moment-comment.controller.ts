import { Controller, Get, Post, Body, Headers, Param, Delete } from '@nestjs/common';
import { MomentCommentService } from './moment-comment.service';
import { CreateMomentCommentDto } from './dto/create-moment-comment.dto';
import { tableName } from '../common/decorator/tableName.decorator';
import { tableNameEnum } from '@app/deep-orm';
import { ApiTags } from '@nestjs/swagger';

@tableName(tableNameEnum.moment_comment)
@ApiTags('moment-comment')
@Controller('moment-comment')
export class MomentCommentController {
  constructor(private readonly momentCommentService: MomentCommentService) {}

  @Post()
  create(@Headers() headers, @Body() createMomentCommentDto: CreateMomentCommentDto) {
    const { id: userId }: { id: string } = JSON.parse(headers.authorization);
    return this.momentCommentService.create(createMomentCommentDto, userId);
  }

  @Get(':id')
  findMomentComment(@Param('id') id: string) {
    return this.momentCommentService.findMomentComment(+id);
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
