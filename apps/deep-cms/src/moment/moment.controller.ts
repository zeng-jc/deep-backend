import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, Query, Headers } from '@nestjs/common';
import { MomentService } from './moment.service';
import { CreateMomentDto } from './dto/create-moment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorator/auth.decorator';
import { PaginationPipe } from '../common/pipe/pagination.pipe';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { DeepHttpException, ErrorMsg, ErrorCode } from '@app/common/exceptionFilter';
import { ApiTags } from '@nestjs/swagger';
import { GetBodyIdPipe } from '../common/pipe/getBodyId.pipe';

@Roles('admin')
@ApiTags('moment')
@Controller('moment')
export class MomentController {
  constructor(private readonly momentService: MomentService) {}

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: {
        fileSize: 4 * 1024 * 1024,
      },
    }),
  )
  createMomentImages(
    @Headers() headers,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createMomentDto: CreateMomentDto,
  ) {
    files.forEach((file) => {
      if (files.length && !file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        throw new DeepHttpException(ErrorMsg.MOMENT_UNSUPPORTED_IMAGE_FILE_TYPE, ErrorCode.MOMENT_UNSUPPORTED_IMAGE_FILE_TYPE);
      }
    });
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.momentService.create(userId, files, createMomentDto, 'images');
  }

  @Post('video')
  @UseInterceptors(
    FilesInterceptor('video', 1, {
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
    }),
  )
  createMomentVideo(@Headers() headers, @UploadedFiles() files: Express.Multer.File[], @Body() createMomentDto: CreateMomentDto) {
    if (files.length && !files[0].originalname.match(/\.(mp4)$/)) {
      throw new DeepHttpException(ErrorMsg.MOMENT_UNSUPPORTED_VIDEO_FILE_TYPE, ErrorCode.MOMENT_UNSUPPORTED_VIDEO_FILE_TYPE);
    }
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.momentService.create(userId, files, createMomentDto, 'video');
  }

  @Get('/list')
  findMomentList(@Query(new PaginationPipe()) paginationParams: PaginationQueryDto) {
    return this.momentService.findMomentList(paginationParams);
  }

  @Get(':id')
  findOneMoment(@Param('id') id: string) {
    return this.momentService.findOneMoment(+id);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.momentService.remove(+id);
  }

  @Post('/change-status')
  changeMomentStatus(@Body(new GetBodyIdPipe()) id: string) {
    return this.momentService.changeMomentStatus(id);
  }

  // 切换点赞
  @Post('toggle-likes/:id')
  toggleLikes(@Headers() headers, @Param('id') id: string) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.momentService.toggleLikes(userId, +id);
  }

  @Get('/label/list')
  findMomentLabelList(@Query(new PaginationPipe()) paginationParams: PaginationQueryDto) {
    return this.momentService.findMomentLabelList(paginationParams);
  }

  @Delete('/label/delete/:id')
  deleteMomentLabelList(@Param('id') id: string) {
    return this.momentService.deleteMomentLabelList(+id);
  }

  @Post('/label/create')
  createMomentLabelList(@Headers() headers, @Body() { name }: { name: string }) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.momentService.createMomentLabelList(+userId, name);
  }
}
