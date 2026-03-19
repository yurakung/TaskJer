import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // เปิด CORS เพื่อยอมรับให้หน้าเว็บ React (Frontend) ยิงข้อมูลเข้ามาได้
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  }); 
  
  await app.listen(5000); // 👈 เปลี่ยนเป็น 5000 ตรงนี้ครับ
}
bootstrap();