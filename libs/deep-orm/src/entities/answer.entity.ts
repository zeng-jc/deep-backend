import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { tableNameEnum } from '../tableNameEnum';
import { QuestionEntity } from './question.entity';
import { UserEntity } from './user.entity';

@Entity({ name: tableNameEnum.answer })
export class AnswerEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column()
  userId: number;
  @Column()
  questionId: number;
  // 用户
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.userAnswer, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  // 问题
  @ManyToOne(() => QuestionEntity, (QuestionEntity) => QuestionEntity.answer, {
    onDelete: 'CASCADE',
  })
  question: QuestionEntity[];
}
