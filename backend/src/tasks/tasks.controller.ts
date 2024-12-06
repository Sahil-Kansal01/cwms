import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskInput } from './dto/createTask.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateTaskInput } from './dto/updateTask.dto';
import { ListTaskInput } from './dto/listTasks.dto';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) { }

    @Post('create')
    @UseGuards(AuthGuard)
    createTask(@Body() createTaskInput: CreateTaskInput) {
        return this.taskService.createTask(createTaskInput);
    }

    @Put('update')
    @UseGuards(AuthGuard)
    updateTask(@Body() updateTaskInput: UpdateTaskInput) {
        return this.taskService.updateTask(updateTaskInput);
    }

    @Delete('delete')
    @UseGuards(AuthGuard)
    deleteTask(@Body('id') id: number) {
        return this.taskService.deleteTask(id);
    }

    @Get('get')
    @UseGuards(AuthGuard)
    getTask(@Body('id') id: number) {
        return this.taskService.getTask(id);
    }

    @Get('list')
    @UseGuards(AuthGuard)
    listTask(@Body() listTaskInput: ListTaskInput) {
        return this.taskService.listTask(listTaskInput);
    }
}
