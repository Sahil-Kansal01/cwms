import { IsEnum, IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { UserRole } from '../enum/role.enum';
import { IsEmailAlreadyExist } from '../validation/email.validation';

export class CreateUserInput {
    @IsString()
    @IsNotEmpty({ message: 'Please provide name!' })
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @IsEmailAlreadyExist()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;
}
