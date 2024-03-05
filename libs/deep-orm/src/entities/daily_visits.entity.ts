import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';

@Entity({ name: tableNameEnum.daily_visits })
export class DailyVisitsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'bigint' })
  count: bigint;
  @Column({ unique: true })
  date: string;
}
