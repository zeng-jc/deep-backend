import { Global, Module } from '@nestjs/common';
import { SecretKeyService } from './secretKey.service';

@Global()
@Module({
  providers: [SecretKeyService],
  exports: [SecretKeyService],
})
export class SecretKeyModule {}
