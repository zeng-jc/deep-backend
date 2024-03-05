import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';

@Entity({ name: tableNameEnum.daily_visits })
export class DailyVisitsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  // TODO: 考虑使用bigint
  @Column()
  count: number;
  @Column({ unique: true })
  date: string;
}
