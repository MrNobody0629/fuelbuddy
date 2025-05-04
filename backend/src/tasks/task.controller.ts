import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ShareTaskDto } from './dto/share-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateTaskDto) {
    return this.taskService.create(req, dto);
  }

  @Get()
  findAll(@Req() req: Request, @Query('type') type: string) {
    return this.taskService.findAll(req, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

}
