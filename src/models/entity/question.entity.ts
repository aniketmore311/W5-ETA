import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User, Answer } from './index';

@Entity({ name: 'questions' })
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.questions)
  user!: User;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers!: Answer[];
}
