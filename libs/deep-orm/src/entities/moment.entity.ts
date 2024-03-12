import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { MomentLabelRelationEntity } from './moment_label_relation.entity';
import { MomentCommentEntity } from './moment_comment.entity';
import { tableNameEnum } from '../tableNameEnum';
import { MomentLikesEntity } from './moment_likes.entity';

@Entity({ name: tableNameEnum.moment })
export class MomentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({ default: 1 })
  status!: number;
  @Column({ type: 'simple-array', nullable: true })
  images?: string[];
  @Column({ type: 'simple-array', nullable: true })
  video?: string[];
  @Column({ type: 'text' })
  content!: string;
  @Column({ default: 1 })
  viewCount: number;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @OneToMany(() => MomentCommentEntity, (momentCommentEntity) => momentCommentEntity.moment)
  comments: MomentCommentEntity[];
  @OneToMany(() => MomentLabelRelationEntity, (momentLabelRelationEntity) => momentLabelRelationEntity.moment)
  labels: MomentLabelRelationEntity[];
  @OneToMany(() => MomentLikesEntity, (momentLikesEntity) => momentLikesEntity.user)
  momentLikes: MomentLikesEntity;
}
