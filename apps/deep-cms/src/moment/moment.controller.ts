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
import {
  DeepHttpException,
  CmsErrorMsg,
  CmsErrorCode,
} from '@app/common/exceptionFilter';

@Roles('admin')
@Controller('moment')
export class MomentController {
  constructor(private readonly momentService: MomentService) {}

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('images', 9, {
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  createMomentImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createMomentDto: CreateMomentDto,
  ) {
    files.forEach((file) => {
      if (files.length && !file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        throw new DeepHttpException(
          CmsErrorMsg.MOMENT_UNSUPPORTED_IMAGE_FILE_TYPE,
          CmsErrorCode.MOMENT_UNSUPPORTED_IMAGE_FILE_TYPE,
        );
      }
    });
    return this.momentService.create(files, createMomentDto, 'images');
  }

  @Post('video')
  @UseInterceptors(
    FilesInterceptor('video', 1, {
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
    }),
  )
  createMomentVideo(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createMomentDto: CreateMomentDto,
  ) {
    if (files.length && !files[0].originalname.match(/\.(mp4)$/)) {
      throw new DeepHttpException(
        CmsErrorMsg.MOMENT_UNSUPPORTED_VIDEO_FILE_TYPE,
        CmsErrorCode.MOMENT_UNSUPPORTED_VIDEO_FILE_TYPE,
      );
    }
    return this.momentService.create(files, createMomentDto, 'video');
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
