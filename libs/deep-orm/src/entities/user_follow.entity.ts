import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';
import { UserEntity } from './user.entity';

@Entity({ name: tableNameEnum.user_follow })
@Unique(['followId', 'followingId'])
export class UserFollowEntity {
  @PrimaryGeneratedColumn()
  id: number;
  // 关注者
  @Column()
  followId: number;
  // 被关注者
  @Column()
  followingId: number;
  // 关注时间
  @CreateDateColumn()
  createAt: Date;
  // 关注的用户
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followId' })
  followUser: UserEntity;
  // 被关注的用户
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followingId' })
  followingUser: UserEntity;
}
