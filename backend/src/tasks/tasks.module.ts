import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/database/users.entity';
import { Tasks } from './database/tasks.entity';
import { Projects } from 'src/projects/database/projects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Tasks, Projects])],
  providers: [TasksService],
  controllers: [TasksController]
})
export class TasksModule { }
