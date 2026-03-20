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
      where: {
        // 🌟 ต้องมี block OR ตรงนี้นะครับ! มันถึงจะดึงงานที่เพื่อนเชิญมาด้วย
        OR: [
          { userId: userId }, // ดึงงานที่สร้างเอง
          { members: { some: { userId: userId } } } // หรือ งานที่ถูกเชิญ
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true }
        }
      }
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
          select: { id: true, name: true, email: true, avatarUrl: true } // ดึงมาแค่ชื่อกับอีเมล (ไม่ดึงรหัสผ่าน)
        }
      }
    });
  }

  async updateMemberRole(projectId: number, targetUserId: number, newRole: string, requesterId: number) {
    // 1. เช็คว่าคนที่กดเปลี่ยนสิทธิ์ เป็น Owner จริงไหม? (ให้ Owner เปลี่ยนสิทธิ์ได้คนเดียว)
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return { success: false, message: 'ไม่พบโปรเจคนี้ในระบบครับ' };
    }
    if (project.userId !== requesterId) {
      return { success: false, message: 'คุณไม่มีสิทธิ์! เฉพาะ Owner เท่านั้นที่ตั้ง Vice-Head ได้' };
    }

    // 2. อัปเดตตำแหน่ง
    await this.prisma.projectMember.update({
      where: {
        projectId_userId: { projectId, userId: targetUserId }
      },
      data: { role: newRole }
    });

    return { success: true, message: `อัปเดตตำแหน่งเป็น ${newRole} เรียบร้อยแล้ว` };
  }

  async kickMember(projectId: number, targetUserId: number, requesterId: number) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return { success: false, message: 'ไม่พบโปรเจคนี้ในระบบครับ' };
    }
    
    // 1. ถ้าคนกดเตะ คือ Owner -> เตะได้ทุกคนเลย ลุย!
    const isOwner = project.userId === requesterId;

    // 2. ถ้าไม่ใช่ Owner ต้องไปเช็คว่าเป็น Vice-Head ไหม
    let isViceHead = false;
    if (!isOwner) {
      const requesterMember = await this.prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: requesterId } }
      });
      if (requesterMember && requesterMember.role === 'vice-head') {
        isViceHead = true;
      }
    }

    // 3. กฎเหล็ก: ถ้าไม่ใช่ทั้ง Owner และ Vice-Head -> ห้ามเตะ!
    if (!isOwner && !isViceHead) {
      return { success: false, message: 'คุณไม่มีสิทธิ์เตะสมาชิกออกครับ' };
    }

    // 4. กฎเหล็ก: Vice-Head ห้ามเตะ Owner เด็ดขาด!
    if (isViceHead && targetUserId === project.userId) {
      return { success: false, message: 'Vice-Head ไม่สามารถเตะ Owner ออกได้ครับ!' };
    }

    // 5. ถ้าผ่านกฎทั้งหมด ก็ทำการลบชื่อออกจากโปรเจค
    await this.prisma.projectMember.delete({
      where: {
        projectId_userId: { projectId, userId: targetUserId }
      }
    });

    return { success: true, message: 'เตะออกจากโปรเจคเรียบร้อยแล้ว' };
  }

  async updateProject(id: number, data: { name?: string; description?: string }) {
    return this.prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  async deleteProject(id: number) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}