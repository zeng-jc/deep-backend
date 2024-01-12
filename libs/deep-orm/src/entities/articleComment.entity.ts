import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity({ name: 'tbl_article_comment' })
export class ArticleCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({})
  article_id!: number;
  @Column()
  user_id!: number;
  @Column()
  reply_id: number;
  @Column({ type: 'varchar', length: 500 })
  content!: string;
  @Column({ type: 'enum', enum: [0, 1], default: 1 })
  state!: number;
  @Column({ default: 0 })
  likes: number;
  @Column()
  create_At: Date;
  @Column()
  update_At: Date;
  @ManyToOne(() => ArticleEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  article: ArticleEntity;
}
