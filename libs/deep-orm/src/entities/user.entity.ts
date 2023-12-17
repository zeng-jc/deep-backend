import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tbl_user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  username!: string;
  // select: false表示不会返给前端
  @Column({ type: 'varchar', length: 500, select: false })
  password!: string;
  @Column({ type: 'varchar', length: 10 })
  nickname!: string;
  @Column({ type: 'enum', enum: [0, 1, 2], default: 2 })
  gender?: number;
  @Column({ type: 'varchar', length: 255, default: '', unique: true })
  email?: string;
  @Column({ type: 'enum', enum: [0, 1], default: 1 })
  status!: number;
  @Column({ type: 'varchar', length: 255, default: '' })
  bio?: string;
  @Column({ type: 'tinyint', default: 1 })
  level?: number;
  @Column({ type: 'date', default: null })
  birthday?: Date;
  @Column({ type: 'varchar', length: 30, default: '' })
  phone?: string;
  @Column({ type: 'varchar', length: 100, default: '' })
  school?: string;
  @Column({ type: 'varchar', length: 255, default: '' })
  major?: string;
  @Column({ type: 'varchar', length: 50, default: '' })
  position?: string;
  @Column({ type: 'varchar', length: 255, default: '' })
  github?: string;
  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
  // 设置关联关系和反向关联关系
  // @OneToMany(() => ArticleEntity, (articleEntity) => articleEntity.user)
  // articles: ArticleEntity[];
}
