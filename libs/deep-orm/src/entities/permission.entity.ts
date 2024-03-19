import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';
import { MenuEntity } from './menu.entity';

@Entity({ name: tableNameEnum.permission })
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;
  @Column()
  desc: string;
  @Column({ nullable: false })
  @Column()
  menuId: number;
  @CreateDateColumn()
  createTime!: Date;
  @UpdateDateColumn()
  updateTime!: Date;
  // 权限对应的菜单
  @ManyToOne(() => MenuEntity, (menu) => menu.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuId' })
  menu: MenuEntity;
}
