import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';
import { PermissionEntity } from './permission.entity';

@Entity({ name: tableNameEnum.menu })
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column({ unique: true })
  title: string;
  @Column({ unique: true })
  path: string;
  @Column({ unique: true, nullable: true })
  component: string;
  @Column({ nullable: true })
  link: string;
  @Column({ nullable: true })
  order: number;
  @Column({ nullable: true })
  icon: string;
  @Column({ nullable: true })
  parentId: number;
  @CreateDateColumn({ select: false })
  createTime: Date;
  @UpdateDateColumn({ select: false })
  updateTime: Date;
  @ManyToOne(() => MenuEntity, (menu) => menu.subMenus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  menu: MenuEntity;
  @OneToMany(() => MenuEntity, (menu) => menu.parentId)
  subMenus: MenuEntity[];
  @OneToMany(() => PermissionEntity, (permission) => permission.menu)
  permissions: PermissionEntity[];
}
