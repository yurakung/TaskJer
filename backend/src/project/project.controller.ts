import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
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
  // รับข้อมูล POST /api/projects/1/invite
  @Post(':id/invite')
  inviteUser(@Param('id') id: string, @Body() body: { email: string }) {
    return this.projectService.inviteUser(Number(id), body.email);
  }

  // รับข้อมูล GET /api/projects/1/members
  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    return this.projectService.getProjectMembers(Number(id));
  }

  @Patch(':projectId/members/:userId/role')
  updateRole(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Body() body: { role: string; requesterId: number }
  ) {
    return this.projectService.updateMemberRole(Number(projectId), Number(userId), body.role, body.requesterId);
  }

  // รับข้อมูล DELETE /api/projects/1/members/2 (เตะออก)
  @Delete(':projectId/members/:userId')
  kickMember(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Body() body: { requesterId: number }
  ) {
    return this.projectService.kickMember(Number(projectId), Number(userId), body.requesterId);
  }
}