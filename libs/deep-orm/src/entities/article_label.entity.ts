import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';
import { ArticleLabelRelationEntity } from './article_label_relation.entity';
import { UserEntity } from './user.entity';

@Entity({ name: tableNameEnum.article_label })
export class ArticleLabelEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name!: string;
  @Column()
  userId!: number;
  @CreateDateColumn()
  createTime: Date;
  @ManyToOne(() => UserEntity, (userEntity) => userEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @OneToMany(() => ArticleLabelRelationEntity, (articleLabelRelationEntity) => articleLabelRelationEntity.label)
  articles: ArticleLabelRelationEntity[];
}
