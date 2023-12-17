import { Module, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/deep-orm/entities/user.entity';
import { UserRepository } from './user.repository';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    {
      // 开启管道验证DTO
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    UserRepository,
    UserService,
  ],
})
export class UserModule {}
