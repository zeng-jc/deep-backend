import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MomentEntity } from './moment.entity';
import { UserEntity } from './user.entity';
import { tableNameEnum } from '../tableNameEnum';

@Entity({ name: tableNameEnum.moment_comment })
export class MomentCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({})
  momentId!: number;
  @Column()
  userId!: number;
  @Column({ nullable: true })
  replyId: number;
  @Column({ nullable: true })
  path: string;
  @Column({ type: 'varchar', length: 500 })
  content!: string;
  @Column({ default: 1 })
  status!: number;
  @Column({ type: 'simple-array', nullable: true })
  likes: string[];
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
