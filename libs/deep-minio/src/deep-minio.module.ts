import { Global, Module, OnModuleInit } from '@nestjs/common';
import { DeepMinioService } from './deep-minio.service';
import { MinioModule } from 'nestjs-minio-client';
import { minioConfig } from './minio-client.config';
import { bucketNameEnum } from './deep-minio.bucket-name';

@Global()
@Module({
  imports: [MinioModule.register(minioConfig)],
  providers: [DeepMinioService],
  exports: [DeepMinioService],
})
export class DeepMinioModule implements OnModuleInit {
  constructor(private readonly deepMinioService: DeepMinioService) {}
  async onModuleInit() {
    await this.deepMinioService.createBucket(bucketNameEnum);
  }
}
