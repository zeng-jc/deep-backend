import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@app/deep-orm/entities';
import { MomentCommentEntity } from './moment_comment.entity';

@Entity({ name: 'tbl_moment' })
export class MomentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: [0, 1], default: 0 })
  status!: number;
  @Column({ length: 30 })
  name: string;
  @Column()
  cover: string;
  @Column()
  imges: string;
  @Column({ type: 'text' })
  content: string;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  // 设置多对一的关联关系
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
}
