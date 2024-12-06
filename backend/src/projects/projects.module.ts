import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/database/users.entity';
import { Projects } from './database/projects.entity';
import { IsDateConstraint } from 'src/users/validation/date.validation';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Projects])],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})
export class ProjectsModule { }
