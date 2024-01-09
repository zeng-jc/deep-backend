import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailService } from '@app/common/emailService/email.service';

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule {}
