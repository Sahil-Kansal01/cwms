import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { DateFormat } from 'src/users/validation/date.validation';
import { TaskStatus } from '../enum/tasks.enum';
import { Priority } from '../enum/priority.enum';

export class ListTaskInput {
    @IsString()
    @IsOptional()
    @DateFormat({ message: "Please enter a valid date with format: YYYY-MM-DD!" })
    dueDate: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus;

    @IsOptional()
    @IsEnum(Priority)
    priority: Priority;

    @IsOptional()
    @IsNumber()
    project: number;

    @IsOptional()
    @IsNumber()
    assigned_to: number;
}
