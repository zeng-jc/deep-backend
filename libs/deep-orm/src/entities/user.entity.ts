import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ArticleEntity, MomentCommentEntity } from '@app/deep-orm/entities';
import { RoleEntity } from './role.entity';
import { MomentEntity } from './moment.entity';
import { tableNameEnum } from '../tableNameEnum';
import { MomentLikesEntity } from './moment_likes.entity';
import { UserFollowEntity } from './user_follow.entity';
import { AnswerEntity } from './answer.entity';
import { QuestionEntity } from './question.entity';
// enum UserStatus {
//   lock = 0,
//   unLock = 1,
// }
// UserStatus.lock;
@Entity({ name: tableNameEnum.user })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  username!: string;
  @Column({ nullable: true })
  avatar!: string;
  // select: false不会返给前端
  @Column({ type: 'varchar', length: 500, select: false })
  password!: string;
  @Column({ type: 'varchar', length: 10 })
  nickname!: string;
  @Column({ type: 'enum', enum: [0, 1, 2], default: 2 })
  gender?: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  email?: string;
  @Column({ type: 'enum', enum: [0, 1], default: 1 })
  status!: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  bio?: string;
  @Column({ type: 'tinyint', default: 1 })
  level?: number;
  @Column({ type: 'date', nullable: true })
  birthday?: Date;
  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  school?: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  major?: string;
  @Column({ type: 'varchar', length: 50, nullable: true })
  position?: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  github?: string;
  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
  // 设置双向（反向）关系(设置后可以通过主表联系附表查询)
  @OneToMany(() => ArticleEntity, (articleEntity) => articleEntity.user)
  articles: ArticleEntity[];
  @OneToMany(() => MomentEntity, (momentEntity) => momentEntity.user)
  moments: MomentEntity[];
  @ManyToMany(() => RoleEntity)
  @JoinTable({ name: tableNameEnum.user_role_relation })
  roles: RoleEntity[];
  @OneToMany(() => MomentCommentEntity, (momentCommentEntity) => momentCommentEntity.user)
  momentComments: MomentCommentEntity[];
  // 用户点赞列表
  @OneToMany(() => MomentLikesEntity, (momentLikesEntity) => momentLikesEntity.user)
  momentLikes: MomentLikesEntity[];
  // 关注的用户
  @OneToMany(() => UserFollowEntity, (userFollowEntity) => userFollowEntity.followUser)
  userFollows: UserFollowEntity[];
  // 被关注的用户（粉丝）
  @OneToMany(() => UserFollowEntity, (userFollowEntity) => userFollowEntity.followingUser)
  userFollowings: UserFollowEntity[];
  // 回答问题表
  @OneToMany(() => AnswerEntity, (answerEntity) => answerEntity.user)
  userAnswer: AnswerEntity[];
  // 提出问题表
  @OneToMany(() => QuestionEntity, (questionEntity) => questionEntity.user)
  questionEntity: QuestionEntity[];
}
