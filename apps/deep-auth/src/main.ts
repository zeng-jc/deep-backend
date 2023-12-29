import { NestFactory } from '@nestjs/core';
import { DeepAuthModule } from './deep-auth.module';

async function bootstrap() {
  const app = await NestFactory.create(DeepAuthModule);
  await app.listen(3001);
}

bootstrap();
