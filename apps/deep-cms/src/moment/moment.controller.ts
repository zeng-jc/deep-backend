import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Request,
  Query,
} from '@nestjs/common';
import { MomentService } from './moment.service';
import { CreateMomentDto } from './dto/create-moment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorator/auth.decorator';
import { PaginationPipe } from '../common/pipe/pagination.pipe';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';

@Roles('admin')
@Controller('moment')
export class MomentController {
  constructor(private readonly momentService: MomentService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createMomentDto: CreateMomentDto,
  ) {
    return this.momentService.create(files, createMomentDto);
  }

  @Get()
  findMultiMoments(
    @Query(new PaginationPipe()) paginationParams: PaginationQueryDto,
    @Request() req,
  ) {
    return this.momentService.findMultiMoments(paginationParams, req.protocol);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.momentService.findOne(+id, req.protocol);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.momentService.remove(+id);
  }
}
