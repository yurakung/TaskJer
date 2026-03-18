import { Controller, Post, Get, Body, Param, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TaskService } from './task.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';


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
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads';
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath); 
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  addMessage(
    @Param('taskId') taskId: string,
    @Body() body: { userId: number; text?: string;},
    @UploadedFile() file?: any
  ) {
    const fileUrl = file ? `http://localhost:5000/uploads/${file.filename}` : undefined;
    return this.taskService.addMessage(Number(taskId), body.userId, body.text, fileUrl);
  }
}