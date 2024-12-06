import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskInput } from './dto/createTask.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from './database/tasks.entity';
import { Brackets, Repository } from 'typeorm';
import { Users } from 'src/users/database/users.entity';
import { Projects } from 'src/projects/database/projects.entity';
import { createResponse } from 'src/response.handler';
import { UpdateTaskInput } from './dto/updateTask.dto';
import { ListTaskInput } from './dto/listTasks.dto';
import { isEmpty } from 'class-validator';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Tasks) private taskRepository: Repository<Tasks>,
        @InjectRepository(Users) private userRepository: Repository<Users>,
        @InjectRepository(Projects) private projectRepository: Repository<Projects>
    ) { }

    async createTask(createTaskInput: CreateTaskInput) {
        const { title, description, assignedTo, dueDate, status, priority, project } = createTaskInput;

        const getProject = await this.projectRepository.findOne({ where: { id: project }, relations: { members: true } });
        if (!getProject) throw new NotFoundException("Project not found!");

        const getUser = await this.userRepository.findOne({ where: { id: assignedTo } });
        if (!getUser) throw new NotFoundException("User not found to which you want to assign this task!");

        const isMember = getProject.members.some(member => member.id === getUser.id);
        if (!isMember) throw new NotFoundException("Assigned user is not a member of this project!");

        const task = new Tasks();
        task.title = title;
        task.status = status;
        task.dueDate = dueDate;
        task.priority = priority;
        task.description = description;
        task.project = getProject;
        task.assigned_to = getUser;
        await this.taskRepository.save(task);
        return createResponse(201, "Task created successfully!");
    }

    async updateTask(updateTaskInput: UpdateTaskInput) {
        const { id, title, description, assignedTo, dueDate, status, priority, project } = updateTaskInput;
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) throw new NotFoundException("Task not found!");

        const getProject = await this.projectRepository.findOne({ where: { id: project }, relations: { members: true } });
        if (!getProject) throw new NotFoundException("Project not found!");

        const getUser = await this.userRepository.findOne({ where: { id: assignedTo } });
        if (!getUser) throw new NotFoundException("User not found to which you want to assign this task!");

        const isMember = getProject.members.some(member => member.id === getUser.id);
        if (!isMember) throw new NotFoundException("Assigned user is not a member of this project!");

        task.title = title;
        task.status = status;
        task.dueDate = dueDate;
        task.priority = priority;
        task.description = description;
        task.project = getProject;
        task.assigned_to = getUser;
        await this.taskRepository.save(task);

        return createResponse(200, "Task updated successfully!");
    }

    async deleteTask(id: number) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) throw new NotFoundException("Task not found!");

        await this.taskRepository.softDelete({ id });
        return createResponse(200, "Task deleted successfully!");
    }

    async getTask(id: number) {
        const task = await this.taskRepository.findOne({ where: { id }, relations: { project: true, assigned_to: true } });
        if (!task) throw new NotFoundException("Task not found!");

        return createResponse(200, "Task fetched successfully!", task);
    }

    async listTask(listTaskInput: ListTaskInput) {
        const { status, dueDate, priority, assigned_to, project } = listTaskInput;

        const [listTasks, count] = await this.taskRepository.createQueryBuilder('task')
            .leftJoinAndSelect('task.assigned_to', 'assigned_to')
            .leftJoinAndSelect('task.project', 'project')
            .andWhere(new Brackets(qb => { status == null ? isEmpty : qb.where('task.status = :status', { status }) }))
            .andWhere(new Brackets(qb => { priority == null ? isEmpty : qb.where('task.priority = :priority', { priority }) }))
            .andWhere(new Brackets(qb => { dueDate == null ? isEmpty : qb.where('task.dueDate = :dueDate', { dueDate }) }))
            .andWhere(new Brackets(qb => { assigned_to == null ? isEmpty : qb.where('assigned_to.id = :assigned_to', { assigned_to }) }))
            .andWhere(new Brackets(qb => { project == null ? isEmpty : qb.where('project.id = :project', { project }) }))
            .orderBy("task.created_at", "DESC")
            .getManyAndCount();

        if (!count) throw new NotFoundException("Tasks not found!");
        return createResponse(200, "Tasks fetched successfully!", { listTasks, count });
    }
}
