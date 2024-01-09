import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@app/common/exceptionFilter';
import { ResponseInterceptor } from '@app/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const PORT = process.env.PORT ?? 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('deep-auth api docs')
    .setDescription('deep-auth api接口文档')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document);
  await app.listen(PORT);
}

bootstrap();
