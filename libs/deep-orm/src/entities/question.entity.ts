import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';
import { AnswerEntity } from './answer.entity';
import { UserEntity } from './user.entity';

@Entity({ name: tableNameEnum.question })
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column()
  userId: number;
  // 用户
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.questionEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  // 答案
  @OneToMany(() => AnswerEntity, (answerEntity) => answerEntity.question)
  answer: AnswerEntity[];
}
