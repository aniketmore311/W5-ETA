import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User, Question } from './index';

@Entity({ name: 'answers' })
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.answers)
  user!: User;

  @ManyToOne(() => Question, (question) => question.answers)
  question!: Question;
}
