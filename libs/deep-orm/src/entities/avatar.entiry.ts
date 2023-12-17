import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '@app/deep-orm/entities/user.entity';

@Entity('tbl_avatar')
export class AvatarEntiry {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  originalname: string;
  @Column()
  filename: string;
  @Column()
  encoding: string;
  @Column()
  minitype: string;
  @Column()
  size: string;
  @Column()
  path: string;
  @Column()
  createAt: Date;
  @Column()
  updateAt: Date;
  @OneToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;
}
