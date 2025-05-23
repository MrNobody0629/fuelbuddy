import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/entity/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
})
export class UsersModule {}
