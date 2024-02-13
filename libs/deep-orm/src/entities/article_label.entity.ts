import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { tableNameEnum } from '../tableNameEnum';

@Entity({ name: tableNameEnum.article_label })
export class ArticleLabelEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name!: string;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @OneToMany(() => ArticleEntity, (articleEntity) => articleEntity.labels)
  articles: ArticleEntity[];
}
