import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { User } from 'src/users/entity/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskAssignment } from './entity/task-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, TaskAssignment])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TasksModule {}
