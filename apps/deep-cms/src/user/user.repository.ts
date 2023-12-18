import { Repository } from 'typeorm';
import { UserEntity } from '@app/deep-orm/entities/user.entity';
import { SetMetadata } from '@nestjs/common';

@SetMetadata('tetsa', UserEntity)
export class UserRepository extends Repository<UserEntity> {
  findUserByName(): string {
    return '123';
  }
}
