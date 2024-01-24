import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MomentLabelRelationEntity } from './moment_label_relation.entity';

@Entity({ name: 'tbl_moment_label' })
export class MomentLabelEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name!: string;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @OneToMany(
    () => MomentLabelRelationEntity,
    (momentLabelRelationEntity) => momentLabelRelationEntity.label,
  )
  moments: MomentLabelRelationEntity[];
}
