import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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
  @Column()
  replyId: number;
  @Column({ type: 'varchar', length: 500 })
  content!: string;
  @Column({ type: 'enum', enum: [0, 1], default: 1 })
  status!: number;
  @Column({ type: 'simple-array', nullable: true })
  likes: string[];
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @ManyToOne(() => MomentEntity, {
    onDelete: 'CASCADE',
  })
  moment: MomentEntity;
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
