import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleEntity } from './article.entity';
import { ArticleLabelEntity } from './article_label.entity';
import { tableNameEnum } from '../tableNameEnum';

@Entity({ name: tableNameEnum.article_label_relation })
export class ArticleLabelRelationEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  articleId: string;
  @Column()
  labelId: string;
  @CreateDateColumn()
  createAt: Date;
  @ManyToOne(() => ArticleEntity, (articleEntity) => articleEntity.labels)
  public article: ArticleEntity;
  @ManyToOne(
    () => ArticleLabelEntity,
    (articleLabelEntity) => articleLabelEntity.articles,
  )
  public label: ArticleLabelEntity;
}
