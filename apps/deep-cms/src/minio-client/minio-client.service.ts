import { Injectable } from '@nestjs/common';
import { MinioClient, MinioService } from 'nestjs-minio-client';

@Injectable()
export class MinioClientService {
  private readonly baseBucket = 'deep-resource';
  constructor(private readonly minio: MinioService) {}
  get client(): MinioClient {
    return this.minio.client;
  }
  async uploadFile(
    file: Express.Multer.File,
    baseBucket: string = this.baseBucket,
  ) {
    const metaData = { 'Content-Type': file.mimetype };
    try {
      await this.client.putObject(
        baseBucket,
        file.originalname,
        file.buffer,
        metaData,
      );
      return 'upload success';
    } catch (error) {}
  }

  async getImageUrl(filename: string, baseBucket: string = this.baseBucket) {
    const presignedUrl = await this.client.presignedGetObject(
      baseBucket,
      filename,
    );
    return presignedUrl;
  }
}
