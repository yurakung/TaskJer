import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // รับข้อมูล POST /api/projects เพื่อสร้างงาน
  @Post()
  create(@Body() body: { name: string; description?: string; userId: number }) {
    return this.projectService.createProject(body);
  }

  // รับข้อมูล GET /api/projects/user/1 เพื่อดึงงานของ User ID 1
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.projectService.getProjectsByUser(Number(userId));
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.getProjectById(Number(id));
  }
}