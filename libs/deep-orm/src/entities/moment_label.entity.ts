import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MomentEntity } from './moment.entity';

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
  @OneToMany(() => MomentEntity, (momentEntity) => momentEntity.momentLabels)
  moments: MomentEntity[];
}
