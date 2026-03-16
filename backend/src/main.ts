import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // เปิด CORS เพื่อยอมรับให้หน้าเว็บ React (Frontend) ยิงข้อมูลเข้ามาได้
  app.enableCors(); 
  
  await app.listen(5000); // 👈 เปลี่ยนเป็น 5000 ตรงนี้ครับ
}
bootstrap();