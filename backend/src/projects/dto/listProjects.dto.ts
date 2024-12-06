import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProjectStatus } from '../enum/status.enum';
import { DateFormat } from 'src/users/validation/date.validation';

export class ListProjectInput {
    @IsString()
    @IsOptional()
    @DateFormat({ message: "Please enter a valid date with format: YYYY-MM-DD!" })
    dueDate: string;

    @IsOptional()
    @IsEnum(ProjectStatus)
    status: ProjectStatus;

    @IsOptional()
    @IsNumber()
    member: number;
}
