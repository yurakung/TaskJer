import { Controller, Patch, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/users') // 🌟 เปลี่ยน path ตรงนี้เป็น api/users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id/profile')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // โฟลเดอร์เก็บไฟล์ (อันเดียวกับที่ใช้ในงานย่อย)
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `profile-${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  async updateProfile(
    @Param('id') id: string,
    @Body() body: { name?: string; password?: string },
    @UploadedFile() file: Express.Multer.File
  ) {
    let avatarUrl: string | undefined = undefined;
    if (file) {
      // 🌟 สร้าง URL รูปภาพเพื่อเอาไปเซฟลง DB
      avatarUrl = `http://localhost:5000/uploads/${file.filename}`; 
    }
    
    return this.userService.updateProfile(Number(id), { ...body, avatarUrl });
  }
}