import { User } from '../../users/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  owner_id: string;

  @Column({ nullable: true })
  assigned_to: string;

  @Column({ enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' })
  status: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => User, (user) => user.assignedTasks)
  @JoinColumn({ name: 'assigned_to' })
  assignee: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
