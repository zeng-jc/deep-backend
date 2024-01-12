import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@app/deep-orm/entities';
import { ArticleCommentEntity } from './articleComment.entity';

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
}
