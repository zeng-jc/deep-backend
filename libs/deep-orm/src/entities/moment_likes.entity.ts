import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';
import { MomentEntity } from './moment.entity';
import { UserEntity } from './user.entity';

@Entity({ name: tableNameEnum.moment_likes })
@Unique(['userId', 'momentId']) // 组合唯一索引
export class MomentLikesEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  momentId: number;
  @CreateDateColumn()
  createTime: Date;
  @ManyToOne(() => MomentEntity, {
    onDelete: 'CASCADE',
  })
  moment: MomentEntity;
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
