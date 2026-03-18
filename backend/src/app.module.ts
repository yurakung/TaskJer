import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { ServeStaticModule } from '@nestjs/serve-static'; 
import {join} from 'path';

@Module({
  imports: [PrismaModule, AuthModule, ProjectModule, TaskModule,
    ServeStaticModule.forRoot({rootPath : join(__dirname, '..', 'uploads'),
    serveRoot: '/uploads',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
