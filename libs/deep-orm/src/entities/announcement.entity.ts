import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';

@Entity({ name: tableNameEnum.announcement })
export class AnnouncementEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  content: string;
  @CreateDateColumn()
  createTime: Date;
}
