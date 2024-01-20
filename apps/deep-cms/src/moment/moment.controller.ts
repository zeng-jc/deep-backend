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
} from '@nestjs/common';
import { MomentService } from './moment.service';
import { CreateMomentDto } from './dto/create-moment.dto';
import { UpdateMomentDto } from './dto/update-moment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('moment')
export class MomentController {
  constructor(private readonly momentService: MomentService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('momentImages'))
  create(
    @UploadedFiles() files: object[],
    @Body() createMomentDto: CreateMomentDto,
  ) {
    return this.momentService.create(files, createMomentDto);
  }

  @Get()
  findAll() {
    return this.momentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.momentService.findOne(+id);
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
