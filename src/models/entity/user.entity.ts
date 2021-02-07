import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Question } from './index';
import { IUser } from '../../types';
import { Answer } from './answer.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  googleID!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column()
  email!: string;

  @Column()
  photo!: string;

  @Column({ nullable: true })
  institute!: string;

  @Column({ nullable: true })
  position!: string;

  @Column({ default: false, name: 'is_teacher' })
  isTeacher!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Question, (question) => question.user, {
    cascade: true,
  })
  questions!: Question[];

  @OneToMany(() => Answer, (answer) => answer.user, {
    cascade: true,
  })
  answers!: Answer[];
}
