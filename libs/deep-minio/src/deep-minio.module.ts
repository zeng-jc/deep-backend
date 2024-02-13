import { Global, Module } from '@nestjs/common';
import { DeepMinioService } from './deep-minio.service';
import { MinioModule } from 'nestjs-minio-client';
import { minioConfig } from './minio-client.config';

@Global()
@Module({
  imports: [MinioModule.register(minioConfig)],
  providers: [DeepMinioService],
  exports: [DeepMinioService],
})
export class DeepMinioModule {}
