import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import { MomentService } from './moment.service';
import { CreateMomentDto } from './dto/create-moment.dto';
import { UpdateMomentDto } from './dto/update-moment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorator/auth.decorator';

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
  findAll() {
    return this.momentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.momentService.findOne(+id, req.protocol);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMomentDto: UpdateMomentDto) {
    return this.momentService.update(+id, updateMomentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.momentService.remove(+id);
  }
}
