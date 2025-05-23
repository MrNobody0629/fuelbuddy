import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ShareTaskDto } from './dto/share-task.dto';
import { Task } from './entity/task.entity';
import { User } from 'src/users/entity/user.entity';
import { TaskAssignment } from './entity/task-assignment.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(TaskAssignment)
    private assignmentRepo: Repository<TaskAssignment>,
  ) {}

  async create(req: Request, dto: CreateTaskDto) {
    const owner_id = req?.['user']?.id;
    if (!owner_id) throw new NotFoundException('Owner not found');

    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      owner_id,
    });
    await this.taskRepo.save(task);
    await this.assignmentRepo.save({
      task_id: task?.id,
      user_id: owner_id,
      assigned_by: owner_id,
    });
    return `task created with id ${task.id}`;
  }

  async findAll(req: Request, type: string) {
    let where = {};
    if (type === 'all') {
      where = [
        { owner_id: req?.['user']?.id },
        { assigned_to: req?.['user']?.id },
      ];
    } else if (type === 'mine') {
      where['owner_id'] = req?.['user']?.id;
    } else if (type === 'shared') {
      where['assigned_to'] = req?.['user']?.id;
    }
    return this.taskRepo.find({ where });
  }

  async findOne(id: string) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    Object.assign(task, dto);
    await this.taskRepo.save(task);
    return `task with id ${id} updated`;
  }

  async remove(req: Request, id: string) {
    const task = await this.taskRepo.findOne({
      where: { id, owner_id: req?.['user']?.id },
    });
    if (!task)
      throw new NotFoundException('Task not found or does not belong to you');
    await this.taskRepo.remove(task);
    return `task with id ${id} deleted`;
  }

  async share(req: Request, dto: ShareTaskDto) {
    const owner_id = req?.['user']?.id;
    const [task, user] = await Promise.all([
      this.taskRepo.findOne({ where: { id: dto.taskId } }),
      this.userRepo.findOne({ where: { email: dto.email } }),
    ]);
    if (!task) throw new NotFoundException('Task not found');
    if (!user) throw new NotFoundException('User not found, Check email id');
    if (task?.assigned_to === user?.id) throw new NotFoundException('Task already shared with this user');
    task.assigned_to = user.id;
    await Promise.all([
      this.taskRepo.save(task),
      this.assignmentRepo.save({
        task_id: task.id,
        user_id: user.id,
        assigned_by: owner_id,
      }),
    ]);
    return `task ${task?.title} shared with user ${user.email}`;
  }
}
