import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@app/deep-orm/entities/user.entity';

@Entity({ name: 'tbl_article' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;
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
}
