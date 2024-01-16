import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity({ name: 'tbl_article_label' })
export class ArticleLabelEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name!: string;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @OneToMany(
    () => ArticleEntity,
    (articleEntity) => articleEntity.articleLabels,
  )
  articles: ArticleEntity[];
}
