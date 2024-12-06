import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CreateProjectInput } from './dto/createProject.dto';
import { ResponseHandler } from 'src/response.handler';
import { ProjectsService } from './projects.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/users/user.decorator';
import { UpdateProjectInput } from './dto/updateProject.dto';
import { ListProjectInput } from './dto/listProjects.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { UserRole } from 'src/users/enum/role.enum';

@Controller('projects')
export class ProjectsController {
    constructor(private projectService: ProjectsService) { }

    @Post('create')
    @UseGuards(RoleGuard)
    @Roles(UserRole.ADMIN)
    createProject(@Body() createProjectInput: CreateProjectInput, @CurrentUser() user): Promise<ResponseHandler> {
        return this.projectService.createProject(createProjectInput, user);
    }

    @Put('update')
    @UseGuards(RoleGuard)
    @Roles(UserRole.ADMIN)
    updateProject(@Body() updateProjectInput: UpdateProjectInput, @CurrentUser() user): Promise<ResponseHandler> {
        return this.projectService.updateProject(updateProjectInput, user);
    }

    @Delete('delete')
    @UseGuards(RoleGuard)
    @Roles(UserRole.ADMIN)
    deleteProject(@Body('id') id: number, @CurrentUser() user): Promise<ResponseHandler> {
        return this.projectService.deleteProject(id, user);
    }

    @Get('get')
    @UseGuards(AuthGuard)
    getProject(@Body('id') id: number, @CurrentUser() user): Promise<ResponseHandler> {
        return this.projectService.getProject(id, user);
    }

    @Get('list')
    @UseGuards(AuthGuard)
    listProjects(@Body() listProjectInput: ListProjectInput, @CurrentUser() user): Promise<ResponseHandler> {
        return this.projectService.listProjects(listProjectInput, user);
    }
}
