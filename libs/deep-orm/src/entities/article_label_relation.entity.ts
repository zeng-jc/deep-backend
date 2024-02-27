import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { tableNameEnum } from '../tableNameEnum';
import { ArticleLabelEntity } from './article_label.entity';

@Entity({ name: tableNameEnum.article_label_relation })
export class ArticleLabelRelationEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  articleId: number;
  @Column()
  labelId: number;
  @CreateDateColumn()
  createAt: Date;
  @ManyToOne(() => ArticleEntity, (articleEntity) => articleEntity.labels, {
    onDelete: 'CASCADE',
  })
  public article: ArticleEntity;
  @ManyToOne(() => ArticleLabelEntity, (articleLabelEntity) => articleLabelEntity.articles, {
    onDelete: 'CASCADE',
  })
  public label: ArticleLabelEntity;
}
