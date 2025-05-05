// src/tasks/task-assignment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from 'src/users/entity/user.entity';

@Entity()
export class TaskAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  task_id: string;

  @Column()
  user_id: string;

  @Column()
  assigned_by: string;

  @ManyToOne(() => Task)
  task: Task;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  assignedBy: User;

  @CreateDateColumn()
  assignedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
