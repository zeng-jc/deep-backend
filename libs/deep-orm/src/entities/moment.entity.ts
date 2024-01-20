import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@app/deep-orm/entities';
import { MomentCommentEntity } from './moment_comment.entity';
import { MomentLabelEntity } from './moment_label.entity';

@Entity({ name: 'tbl_moment' })
export class MomentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: [0, 1], default: 0 })
  status!: number;
  @Column()
  images?: string;
  @Column()
  video?: string;
  @Column({ type: 'text' })
  content!: string;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;
  @OneToMany(
    () => MomentCommentEntity,
    (momentCommentEntity) => momentCommentEntity.moment,
  )
  momentCommnets: MomentCommentEntity[];
  @ManyToMany(
    () => MomentLabelEntity,
    (momentLabelEntity) => momentLabelEntity.moments,
    { cascade: true },
  )
  momentLabels: MomentLabelEntity[];
}
