import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MomentEntity } from './moment.entity';
import { MomentLabelEntity } from './moment_label.entity';

@Entity({ name: 'tbl_moment_label_relation' })
export class MomentLabelRelationEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  momentId: string;
  @Column()
  labelId: string;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @ManyToOne(() => MomentEntity, (momentEntity) => momentEntity.momentLabels)
  public moment: MomentEntity;
  @ManyToOne(
    () => MomentLabelEntity,
    (momentLabelEntity) => momentLabelEntity.moments,
  )
  public momentLabel: MomentLabelEntity;
}
