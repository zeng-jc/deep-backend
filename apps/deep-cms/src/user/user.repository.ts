import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '@app/deep-orm/entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  findUserByName(): string {
    return '---';
  }
}
