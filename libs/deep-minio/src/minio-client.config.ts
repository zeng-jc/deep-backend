import { configLoader } from '@app/common/configLoader';
interface ClientOptions {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
}

export const minioConfig: ClientOptions = configLoader<ClientOptions>('minio');
