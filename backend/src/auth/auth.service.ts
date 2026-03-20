import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // ฟังก์ชันสมัครสมาชิก
  async register(data: any) {
    const { name, email, password } = data;

    // 1. เช็คว่าอีเมลนี้ซ้ำไหม?
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException({ success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    // 2. เข้ารหัสผ่าน (ซ่อนรหัสจริง)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. บันทึกลง Database
    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true, message: 'สมัครสมาชิกสำเร็จ!' };
  }

  // ฟังก์ชันเข้าสู่ระบบ
  async login(data: any) {
    const { email, password } = data;

    // 1. หาข้อมูล User จากอีเมล
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException({ success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // 2. เทียบรหัสผ่านที่กรอกมา กับรหัสที่เข้ารหัสไว้ใน Database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({ success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    return { 
      success: true, 
      message: 'เข้าสู่ระบบสำเร็จ!', 
      token: 'mock-jwt-token-12345',
      user: { id: user.id, name: user.name, role: user.role, avatarUrl: user.avatarUrl }
    };
  }
}