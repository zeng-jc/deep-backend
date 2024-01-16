import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ArticleCommentEntity } from './articleComment.entity';
import { ArticleLabelEntity } from './articleLabel.entity';

@Entity({ name: 'tbl_article' })
export class ArticleEntity {
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
    () => ArticleCommentEntity,
    (articleCommentEntity) => articleCommentEntity.article,
  )
  articleCommnets: ArticleCommentEntity[];
  @ManyToMany(
    () => ArticleLabelEntity,
    (articleLabelEntity) => articleLabelEntity.articles,
    { cascade: true },
  )
  // @JoinTable({ name: 'tbl_article_label_relation' })
  @JoinTable()
  articleLabels: ArticleLabelEntity[];
}
