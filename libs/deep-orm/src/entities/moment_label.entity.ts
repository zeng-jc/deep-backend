import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MomentLabelRelationEntity } from './moment_label_relation.entity';
import { tableNameEnum } from '../tableNameEnum';
import { UserEntity } from './user.entity';

@Entity({ name: tableNameEnum.moment_label })
export class MomentLabelEntity {
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
  @OneToMany(() => MomentLabelRelationEntity, (momentLabelRelationEntity) => momentLabelRelationEntity.label)
  moments: MomentLabelRelationEntity[];
}
