import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';
import { ArticleEntity } from './article.entity';
import { UserEntity } from './user.entity';

@Entity({ name: tableNameEnum.article_likes })
export class ArticleLikesEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  articleId: number;
  @CreateDateColumn()
  createAt: Date;
  @ManyToOne(() => ArticleEntity, {
    onDelete: 'CASCADE',
  })
  article: ArticleEntity;
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}