import { Module } from '@nestjs/common';
import { MinioClientController } from './minio-client.controller';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import { configLoader } from '@app/common/configLoader';
interface ClientOptions {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
}

export const minioConfig: ClientOptions = configLoader<ClientOptions>('minio');

@Module({
  imports: [MinioModule.register(minioConfig)],
  controllers: [MinioClientController],
  providers: [MinioClientService],
})
export class MinioClientModule {}
