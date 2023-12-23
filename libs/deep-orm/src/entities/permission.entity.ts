import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tbl_permission' })
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 255 })
  name!: string;
  @Column({ type: 'varchar', length: 255, default: '' })
  desc: string;
  @CreateDateColumn()
  createAt!: Date;
  @UpdateDateColumn()
  updateAt!: Date;
}
