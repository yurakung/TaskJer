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
  // ฟังก์ชันสำหรับเชิญคนเข้าโปรเจคด้วย Email
  async inviteUser(projectId: number, email: string) {
    // 1. ตามหาตัว User จาก Email ในระบบ
    const userToInvite = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!userToInvite) {
      return { success: false, message: 'ไม่พบผู้ใช้งานที่ใช้ Email นี้ในระบบ' };
    }

    // 2. เช็คว่าคนๆ นี้อยู่ในโปรเจคนี้อยู่แล้วหรือเปล่า
    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userToInvite.id,
        },
      },
    });

    if (existingMember) {
      return { success: false, message: 'ผู้ใช้งานคนนี้อยู่ในโปรเจคนี้อยู่แล้วครับ' };
    }

    // 3. จับเพิ่มเข้าตารางสมาชิกโปรเจค
    await this.prisma.projectMember.create({
      data: {
        projectId: projectId,
        userId: userToInvite.id,
      },
    });

    return { success: true, message: 'เชิญสำเร็จ!' };
  }

  // ฟังก์ชันสำหรับดูว่าโปรเจคนี้มีใครเป็นสมาชิกบ้าง
  async getProjectMembers(projectId: number) {
    return this.prisma.projectMember.findMany({
      where: { projectId: projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true } // ดึงมาแค่ชื่อกับอีเมล (ไม่ดึงรหัสผ่าน)
        }
      }
    });
  }
}