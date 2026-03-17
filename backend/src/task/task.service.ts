import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // ฟังก์ชันสร้างงานย่อยใหม่
  async createTask(data: { title: string; projectId: number }) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        projectId: data.projectId, // ผูกกับโปรเจคที่ส่งมา
      },
    });
  }

  // ฟังก์ชันดึงงานย่อยทั้งหมด "ของโปรเจคนั้นๆ"
  async getTasksByProject(projectId: number) {
    return this.prisma.task.findMany({
      where: { projectId: projectId },
      orderBy: { createdAt: 'desc' }, // เรียงอันใหม่ล่าสุดขึ้นก่อน
    });
  }
}