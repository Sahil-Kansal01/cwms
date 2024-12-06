import { IsEnum, IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { DateFormat } from 'src/users/validation/date.validation';
import { TaskStatus } from '../enum/tasks.enum';
import { Priority } from '../enum/priority.enum';

export class UpdateTaskInput {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty({ message: 'Please provide title!' })
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    @DateFormat({ message: "Please enter a valid date with format: YYYY-MM-DD!" })
    dueDate: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus;

    @IsOptional()
    @IsEnum(Priority)
    priority: Priority;

    @IsNumber()
    @IsNotEmpty()
    assignedTo: number;

    @IsNumber()
    @IsNotEmpty()
    project: number;
}
