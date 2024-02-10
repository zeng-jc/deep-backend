import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';

@Entity({ name: tableNameEnum.menu })
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  path: string;
  @Column()
  title: string;
  @Column()
  parentMenu: number;
  @Column()
  icon: string;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
}
