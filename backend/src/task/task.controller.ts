import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
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
  
  @Get('detail/:taskId')
  getTaskDetail(@Param('taskId') taskId: string) {
    return this.taskService.getTaskDetail(Number(taskId));
  }

  // มอบหมายงาน (Assign) -> POST /api/tasks/1/assign
  @Post(':taskId/assign')
  assignUser(
    @Param('taskId') taskId: string,
    @Body() body: { targetUserId: number; requesterId: number }
  ) {
    return this.taskService.assignUserToTask(Number(taskId), body.targetUserId, body.requesterId);
  }

  // ส่งแชทหรือส่งงาน -> POST /api/tasks/1/message
  @Post(':taskId/message')
  addMessage(
    @Param('taskId') taskId: string,
    @Body() body: { userId: number; text?: string; fileUrl?: string }
  ) {
    return this.taskService.addMessage(Number(taskId), body.userId, body.text, body.fileUrl);
  }
}