import { NestFactory } from '@nestjs/core';
import { DeepAuthModule } from './deep-auth.module';

const PORT = process.env.PORT ?? 3001;

async function bootstrap() {
  const app = await NestFactory.create(DeepAuthModule);
  await app.listen(PORT);
}

bootstrap();
