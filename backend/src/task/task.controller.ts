import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('api/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // รับข้อมูล POST /api/tasks เพื่อสร้างงาน
  @Post()
  create(@Body() body: { title: string; projectId: number }) {
    return this.taskService.createTask(body);
  }

  // รับข้อมูล GET /api/tasks/project/5 เพื่อดึงงานของโปรเจค ID 5
  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.taskService.getTasksByProject(Number(projectId));
  }
}