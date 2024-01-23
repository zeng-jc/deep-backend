import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MomentEntity } from './moment.entity';
import { MomentLabelEntity } from './moment_label.entity';

@Entity({ name: 'tbl_moment_label_relation' })
export class MomentLabelRelationEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  momentId: number;
  @Column()
  labelId: number;
  @CreateDateColumn()
  createAt: Date;
  @ManyToOne(() => MomentEntity, (momentEntity) => momentEntity.labels)
  public moment: MomentEntity;
  @ManyToOne(
    () => MomentLabelEntity,
    (momentLabelEntity) => momentLabelEntity.moments,
  )
  public label: MomentLabelEntity;
}
