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
import { UserEntity } from './user.entity';
import { ArticleCommentEntity } from './article_comment.entity';
import { ArticleLabelEntity } from './article_label.entity';
import { tableNameEnum } from '../tableNameEnum';

@Entity({ name: tableNameEnum.article })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: [0, 1], default: 0 })
  status!: number;
  @Column({ length: 30 })
  name!: string;
  @Column()
  cover?: string;
  @Column({ default: '' })
  images?: string;
  @Column({ type: 'text' })
  content!: string;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @OneToMany(() => ArticleCommentEntity, (articleCommentEntity) => articleCommentEntity.article)
  comments: ArticleCommentEntity[];
  @ManyToMany(() => ArticleLabelEntity, (articleLabelEntity) => articleLabelEntity.articles)
  labels: ArticleLabelEntity[];
}
