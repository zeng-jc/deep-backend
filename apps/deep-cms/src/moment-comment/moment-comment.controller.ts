import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MomentCommentService } from './moment-comment.service';
import { CreateMomentCommentDto } from './dto/create-moment-comment.dto';
import { UpdateMomentCommentDto } from './dto/update-moment-comment.dto';

@Controller('moment-comment')
export class MomentCommentController {
  constructor(private readonly momentCommentService: MomentCommentService) {}

  @Post()
  create(@Body() createMomentCommentDto: CreateMomentCommentDto) {
    return this.momentCommentService.create(createMomentCommentDto);
  }

  @Get()
  findAll() {
    return this.momentCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.momentCommentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMomentCommentDto: UpdateMomentCommentDto,
  ) {
    return this.momentCommentService.update(+id, updateMomentCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.momentCommentService.remove(+id);
  }
}
