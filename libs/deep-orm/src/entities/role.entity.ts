import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { MenuEntity } from './menu.entity';
import { tableNameEnum } from '../tableNameEnum';

@Entity({ name: tableNameEnum.role })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;
  @Column({ default: 1 })
  status!: number;
  @Column()
  desc: string;
  @CreateDateColumn()
  createTime!: Date;
  @UpdateDateColumn()
  updateTime!: Date;
  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: tableNameEnum.role_permission_relation,
  })
  permissions: PermissionEntity[];

  @ManyToMany(() => MenuEntity)
  @JoinTable({
    name: tableNameEnum.role_menu_relation,
  })
  menus: MenuEntity[];
}
