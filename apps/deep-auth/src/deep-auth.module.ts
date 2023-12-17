import { Module } from '@nestjs/common';
import { DeepAuthController } from './deep-auth.controller';
import { DeepAuthService } from './deep-auth.service';

@Module({
  imports: [],
  controllers: [DeepAuthController],
  providers: [DeepAuthService],
})
export class DeepAuthModule {}
