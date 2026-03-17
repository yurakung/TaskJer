import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  // ฟังก์ชันสร้างโปรเจคใหม่
  async createProject(data: { name: string; description?: string; userId: number }) {
    return this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description || '',
        userId: data.userId, // เอา ID ของคนที่ล็อกอินอยู่มาผูก
      },
    });
  }

  // ฟังก์ชันดึงโปรเจคทั้งหมดของ User คนนั้นๆ มาแสดง
  async getProjectsByUser(userId: number) {
    return this.prisma.project.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }, // เรียงจากอันใหม่สุดขึ้นก่อน
    });
  }
  async getProjectById(id: number) {
    return this.prisma.project.findUnique({
      where: { id: id },
    });
  }
}