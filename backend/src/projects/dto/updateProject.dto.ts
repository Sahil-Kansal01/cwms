import {
    IsArray,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    ArrayNotEmpty,
    ArrayMinSize,
    IsNumber
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus } from '../enum/status.enum';
import { DateFormat } from 'src/users/validation/date.validation';

export class UpdateProjectInput {
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
    startDate: string;

    @IsString()
    @IsNotEmpty()
    @DateFormat({ message: "Please enter a valid date with format: YYYY-MM-DD!" })
    dueDate: string;

    @IsEnum(ProjectStatus)
    @IsNotEmpty()
    status: ProjectStatus;

    @IsArray()
    @ArrayNotEmpty({ message: 'Members array should not be empty!' })
    @ArrayMinSize(1, { message: 'At least one member must be provided!' })
    @Type(() => Number)
    @IsInt({ each: true, message: 'Each member must be an integer!' })
    members: number[];
}
