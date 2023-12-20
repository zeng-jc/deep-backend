import { Module, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/deep-orm/entities/user.entity';
import { APP_PIPE } from '@nestjs/core';
import { AvatarEntiry } from '@app/deep-orm/entities/avatar.entiry';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AvatarEntiry])],
  controllers: [UserController],
  providers: [
    {
      // 开启管道验证DTO
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    UserService,
  ],
})
export class UserModule {}
