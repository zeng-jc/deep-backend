import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MomentEntity } from './moment.entity';

@Entity({ name: 'tbl_moment_comment' })
export class MomentCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({})
  moment_id!: number;
  @Column()
  user_id!: number;
  @Column()
  reply_id: number;
  @Column({ type: 'varchar', length: 500 })
  content!: string;
  @Column({ type: 'enum', enum: [0, 1], default: 1 })
  state!: number;
  @Column({ default: 0 })
  likes: number;
  @Column()
  createAt: Date;
  @Column()
  updateAt: Date;
  @ManyToOne(() => MomentEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  moment: MomentEntity;
}
