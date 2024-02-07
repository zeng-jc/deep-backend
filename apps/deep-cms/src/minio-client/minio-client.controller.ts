import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MinioClientService } from './minio-client.service';

@ApiTags('minio')
@Controller('minio')
export class MinioClientController {
  constructor(private readonly minioService: MinioClientService) {}
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMinio(@UploadedFile() file: Express.Multer.File) {
    return await this.minioService.upload(file);
  }

  @ApiOperation({ summary: '删除文件' })
  @Delete('deleteFile/:fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    return await this.minioService.deleteFile(fileName);
  }

  @ApiOperation({ summary: '文件列表' })
  @Get('fileList')
  async fileList() {
    return await this.minioService.listAllFilesByBucket();
  }

  @Get('find-one')
  async getImageUrl(@Query() query: { filename: string }) {
    const imageUrl = await this.minioService.getImageUrl(query.filename);
    return imageUrl;
  }
}
