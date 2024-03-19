import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';
import { ArticleLabelRelationEntity } from './article_label_relation.entity';

@Entity({ name: tableNameEnum.article_label })
export class ArticleLabelEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name!: string;
  @CreateDateColumn()
  createTime: Date;
  @OneToMany(() => ArticleLabelRelationEntity, (articleLabelRelationEntity) => articleLabelRelationEntity.label)
  articles: ArticleLabelRelationEntity[];
}
