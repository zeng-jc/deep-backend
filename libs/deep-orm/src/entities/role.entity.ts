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
import { MenuEntity } from './menu.entity';

@Entity({ name: 'tbl_role' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;
  @Column({ type: 'varchar', length: 255 })
  desc: string;
  @CreateDateColumn()
  createAt!: Date;
  @UpdateDateColumn()
  updateAt!: Date;
  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'tbl_role_permission_relation',
  })
  permissions: PermissionEntity[];
  @ManyToMany(() => MenuEntity)
  @JoinTable({
    name: 'tbl_role_menu_relation',
  })
  enums: MenuEntity[];
}
