import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Entity({ name: 'tbl_role' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;
  @Column({ type: 'varchar', length: 255, default: '' })
  desc: string;
  @CreateDateColumn()
  createAt!: Date;
  @UpdateDateColumn()
  updateAt!: Date;
  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'relation_role_permission',
  })
  permissions: PermissionEntity[];
}
