import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';

@Entity({ name: tableNameEnum.permission })
export class PermissionEntity {
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
}
