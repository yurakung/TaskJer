import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // ฟังก์ชันสร้างงานย่อยใหม่
  async createTask(data: { title: string; projectId: number; description?: string; fileUrl?: string; fileName?: string }) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        projectId: data.projectId, // ผูกกับโปรเจคที่ส่งมา
        description: data.description, // บันทึกรายละเอียด
        fileUrl: data.fileUrl,         // บันทึกลิงก์ไฟล์อ้างอิง
        fileName: data.fileName        // บันทึกชื่อไฟล์อ้างอิง
      },
    });
  }

  // ฟังก์ชันดึงงานย่อยทั้งหมด "ของโปรเจคนั้นๆ"
  async getTasksByProject(projectId: number) {
    return this.prisma.task.findMany({
      where: { projectId: projectId },
      orderBy: { createdAt: 'desc' }, // เรียงอันใหม่ล่าสุดขึ้นก่อน
      include: { 
        assignees: {
          include: {
            user: {
              select: { name: true } 
            }
          }
        } 
      }
    });
  }
  async assignUserToTask(taskId: number, targetUserId: number, requesterId: number) {
    // ดึงข้อมูลงานย่อย เพื่อดูว่าอยู่โปรเจคไหน
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });
    if (!task) return { success: false, message: 'ไม่พบงานย่อยนี้' };

    const projectId = task.projectId;

    // เช็คสิทธิ์คนสั่ง (requester) ว่าเป็น Owner หรือ Vice-Head ไหม?
    const isOwner = task.project.userId === requesterId;
    let isViceHead = false;

    if (!isOwner) {
      const requesterMember = await this.prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: requesterId } }
      });
      if (requesterMember && requesterMember.role === 'vice-head') {
        isViceHead = true;
      }
    }

    // กฎเหล็ก: ถ้าไม่ใช่ Owner หรือ Vice-Head ห้ามเชิญคนเข้างานย่อย!
    if (!isOwner && !isViceHead) {
      return { success: false, message: 'เฉพาะ Owner หรือ Vice-Head เท่านั้นที่มอบหมายงานได้ครับ' };
    }

    // บันทึกชื่อลงตารางมอบหมายงาน
    try {
      await this.prisma.taskAssignee.create({
        data: { taskId: taskId, userId: targetUserId }
      });
      return { success: true, message: 'เพิ่มคนรับผิดชอบงานสำเร็จ!' };
    } catch (error) {
      return { success: false, message: 'ผู้ใช้งานคนนี้อยู่ในงานย่อยนี้อยู่แล้วครับ' };
    }
  }
  async addMessage(taskId: number, userId: number, text?: string, fileUrl?: string, fileName?: string) {
    // ต้องมีข้อความหรือไฟล์อย่างใดอย่างหนึ่ง ถึงจะส่งได้
    if (!text && !fileUrl) {
      return { success: false, message: 'กรุณาพิมพ์ข้อความหรือแนบไฟล์' };
    }

    const message = await this.prisma.taskMessage.create({
      data: { 
        taskId: Number(taskId),
        userId: Number(userId), 
        text: text, 
        fileUrl: fileUrl,
        fileName: fileName
      },
      include: { user: { select: { name: true } } } // ดึงชื่อคนส่งมาด้วย
    });

    return { success: true, data: message };
  }
  async getTaskDetail(taskId: number) {
    return this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: {
          include: { user: { select: { id: true, name: true, email: true } } }
        },
        messages: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' } // เรียงแชทเก่าไปใหม่ (บนลงล่าง)
        }
      }
    });
  }
  async deleteTask(taskId: number){
    return this.prisma.task.delete({
      where: { id: taskId}
    })
  }
}

