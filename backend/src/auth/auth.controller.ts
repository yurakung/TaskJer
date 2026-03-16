import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api') // กำหนดให้ URL ขึ้นต้นด้วย /api
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // รับข้อมูลที่ยิงมาทาง POST http://localhost:5000/api/register
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login') // รับข้อมูลที่ยิงมาทาง POST http://localhost:5000/api/login
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}