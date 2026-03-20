import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(id: number, data: { name?: string; password?: string; avatarUrl?: string }) {
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.avatarUrl) updateData.avatarUrl = data.avatarUrl;
    
    // ถ้ามีการส่งรหัสผ่านใหม่มา ให้ทำการเข้ารหัส (Hash) ก่อนเซฟลง Database
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(data.password, salt);
    }

    // เซฟลง Database และส่งข้อมูลกลับไปให้หน้าเว็บอัปเดต
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, name: true, avatarUrl: true }, 
    });
  }
}