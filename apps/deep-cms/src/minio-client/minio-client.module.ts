import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import { minioConfig } from './minio-client.config';

@Module({
  imports: [MinioModule.register(minioConfig)],
  providers: [MinioClientService],
})
export class MinioClientModule {}
