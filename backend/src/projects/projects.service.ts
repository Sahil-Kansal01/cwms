import { CreateProjectInput } from './dto/createProject.dto';
import { Users } from 'src/users/database/users.entity';
import { createResponse, ResponseHandler } from 'src/response.handler';
import { Projects } from './database/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, In, Repository } from 'typeorm';
import { UpdateProjectInput } from './dto/updateProject.dto';
import { ListProjectInput } from './dto/listProjects.dto';
import { isEmpty } from 'class-validator';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Projects) private projectRepository: Repository<Projects>,
        @InjectRepository(Users) private userRepository: Repository<Users>
    ) { }

    async createProject(createProjectInput: CreateProjectInput, user: Users): Promise<ResponseHandler> {
        const { title, description, startDate, dueDate, status, members } = createProjectInput;
        const project = new Projects();
        project.title = title;
        project.description = description;
        project.startDate = startDate;
        project.dueDate = dueDate;
        project.status = status;
        project.created_by = user;

        members.push(user.id);
        const validMembers = await this.userRepository.findBy({ id: In([...new Set(members)]) });
        if (validMembers.length !== members.length) throw new BadRequestException('Some members are invalid!');
        project.members = validMembers;

        await this.projectRepository.save(project);
        return createResponse(201, "Project created successfully!");
    }

    async updateProject(updateProjectInput: UpdateProjectInput, user: Users): Promise<ResponseHandler> {
        const { id, title, description, startDate, dueDate, status, members } = updateProjectInput;

        const project = await this.projectRepository.findOne({ where: { id: id }, relations: { members: true, created_by: true } });
        if (!project) throw new NotFoundException("Project not found!");

        project.title = title;
        project.description = description;
        project.startDate = startDate;
        project.dueDate = dueDate;
        project.status = status;
        project.updated_at = new Date(Date.now());

        members.push(project.created_by.id);
        const validMembers = await this.userRepository.findBy({ id: In([...new Set(members)]) });
        if (validMembers.length !== members.length) throw new BadRequestException('Some members are invalid!');
        project.members = validMembers;

        await this.projectRepository.save(project);
        return createResponse(201, "Project updated successfully!");
    }

    async deleteProject(id: number, user: Users) {
        const project = await this.projectRepository.findOne({ where: { id: id } });
        if (!project) throw new NotFoundException("Project not found!");

        await this.projectRepository.softDelete({ id: id });
        return createResponse(200, "Project deleted successfully!");
    }

    async getProject(id: number, user: Users) {
        const project = await this.projectRepository.findOne({ where: { id: id }, relations: { created_by: true, members: true } });
        if (!project) throw new NotFoundException("Project not found!");
        return createResponse(200, "Project fetched successfully!", project);
    }

    async listProjects(listProjectInput: ListProjectInput, user: Users) {
        const { status, dueDate, member } = listProjectInput;

        const [listProjects, count] = await this.projectRepository.createQueryBuilder('project')
            .leftJoinAndSelect('project.created_by', 'created_by')
            .leftJoin('project.members', 'members')
            .andWhere(new Brackets(qb => { status == null ? isEmpty : qb.where('project.status = :status', { status }) }))
            .andWhere(new Brackets(qb => { dueDate == null ? isEmpty : qb.where('project.dueDate = :dueDate', { dueDate }) }))
            .andWhere(new Brackets(qb => { member == null ? isEmpty : qb.where('members.id = :member', { member }) }))
            .orderBy("project.created_at", "DESC")
            .getManyAndCount();

        if (!count) throw new NotFoundException("Project not found!");
        return createResponse(200, "Projects fetched successfully!", { listProjects, count });
    }
}
