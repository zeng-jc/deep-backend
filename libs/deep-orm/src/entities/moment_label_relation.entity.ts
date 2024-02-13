import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MomentEntity } from './moment.entity';
import { MomentLabelEntity } from './moment_label.entity';
import { tableNameEnum } from '../tableNameEnum';

@Entity({ name: tableNameEnum.moment_label_relation })
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
  @ManyToOne(() => MomentLabelEntity, (momentLabelEntity) => momentLabelEntity.moments)
  public label: MomentLabelEntity;
}
