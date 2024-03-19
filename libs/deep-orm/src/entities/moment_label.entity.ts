import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MomentLabelRelationEntity } from './moment_label_relation.entity';
import { tableNameEnum } from '../tableNameEnum';

@Entity({ name: tableNameEnum.moment_label })
export class MomentLabelEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name!: string;
  @CreateDateColumn()
  createTime: Date;
  @OneToMany(() => MomentLabelRelationEntity, (momentLabelRelationEntity) => momentLabelRelationEntity.label)
  moments: MomentLabelRelationEntity[];
}
