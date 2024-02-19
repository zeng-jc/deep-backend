import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { tableNameEnum } from '../tableNameEnum';
import { UserEntity } from './user.entity';

@Entity({ name: tableNameEnum.article_comment })
export class ArticleCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({})
  articleId!: number;
  @Column()
  userId!: number;
  @Column()
  replyId: number;
  @Column({ nullable: true })
  path: string;
  @Column({ type: 'varchar', length: 500 })
  content!: string;
  @Column({ type: 'enum', enum: [0, 1], default: 1 })
  status!: number;
  @Column({ type: 'simple-array', nullable: true })
  likes: string[];
  @Column()
  createAt: Date;
  @Column()
  updateAt: Date;
  @ManyToOne(() => ArticleEntity, (articleEntity) => articleEntity.comments, {
    onDelete: 'CASCADE',
  })
  article: ArticleEntity;
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.momentComments, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
