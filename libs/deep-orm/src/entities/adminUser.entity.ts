import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class adminUser {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  adminUsername!: string;
  @Column()
  adminPassword!: string;
  @Column()
  adminEmail!: string;
  @Column({ type: 'enum', enum: [0, 1], default: 1 })
  adminStatus!: number;
  @Column()
  lastLoginAt!: Date;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updateAt!: Date;
}
