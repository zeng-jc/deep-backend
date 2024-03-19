import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ArticleCommentEntity } from './article_comment.entity';
import { tableNameEnum } from '../tableNameEnum';
import { ArticleLikesEntity } from './article_likes.entity';
import { ArticleLabelRelationEntity } from './article_label_relation.entity';

@Entity({ name: tableNameEnum.article })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: 1 })
  status!: number;
  @Column({ length: 30 })
  title!: string;
  @Column({ type: 'simple-array', nullable: true, select: false })
  images?: string[];
  @Column()
  cover?: string;
  @Column({ default: 1 })
  viewCount: number;
  @Column({ type: 'text' })
  content!: string;
  @CreateDateColumn()
  createTime: Date;
  @UpdateDateColumn()
  updateTime: Date;
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @OneToMany(() => ArticleCommentEntity, (articleCommentEntity) => articleCommentEntity.article)
  comments: ArticleCommentEntity[];
  @OneToMany(() => ArticleLabelRelationEntity, (articleLabelRelationEntity) => articleLabelRelationEntity.article)
  labels: ArticleLabelRelationEntity[];
  @OneToMany(() => ArticleLikesEntity, (articleLikesEntity) => articleLikesEntity.user)
  articleLikes: ArticleLikesEntity;
}
