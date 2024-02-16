import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';
import { MomentEntity } from './moment.entity';
import { UserEntity } from './user.entity';

@Entity({ name: tableNameEnum.moment_likes })
export class MomentLikesEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  momentId: number;
  @CreateDateColumn()
  createAt: Date;
  @ManyToOne(() => MomentEntity, {
    onDelete: 'CASCADE',
  })
  moment: MomentEntity;
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
