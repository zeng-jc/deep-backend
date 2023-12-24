import { Module, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity, UserEntity } from '@app/deep-orm/entities';
import { APP_PIPE } from '@nestjs/core';
import { AvatarEntity } from '@app/deep-orm/entities';
import { EmailService } from '../common/service/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AvatarEntity, RoleEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    UserService,
    EmailService,
  ],
})
export class UserModule {}
